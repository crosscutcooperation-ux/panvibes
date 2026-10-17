import fs from 'node:fs/promises';
import ts from 'typescript';

const source = 'https://www.panvibesexim.com/product.php';
const response = await fetch(source);
if (!response.ok) throw new Error(`Catalogue request failed: ${response.status}`);
const html = await response.text();
const declaration = html.match(/const productData\s*=\s*\{[\s\S]*?\n\};/);
if (!declaration) throw new Error('The source productData declaration was not found.');
// Read literal data through an AST; never execute downloaded website scripts.
const ast = ts.createSourceFile('source.js',declaration[0],ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
function literal(node) {
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property=>{
    if (!ts.isPropertyAssignment(property)||!(ts.isIdentifier(property.name)||ts.isStringLiteral(property.name))) throw new Error('Nonliteral catalogue property.');
    return [property.name.text,literal(property.initializer)];
  }));
  throw new Error('Unexpected executable expression in catalogue data.');
}
const statement=ast.statements[0];
if (!ts.isVariableStatement(statement)) throw new Error('Expected a catalogue variable declaration.');
const data=literal(statement.declarationList.declarations[0].initializer);
const keys=['makhana','dairy','agricultural','textiles','electronics','chemicals','machinery','food','steel','automotive','millets','stone','admixtures'];
const categories=keys.map(key=>{
  const category=data[key];
  if (!category?.items?.length) throw new Error(`Missing source category: ${key}`);
  return {key,title:category.title.trim(),types:category.items.map(item=>({name:item.name,grades:(item.subItems||[]).map(grade=>grade.name)}))};
});
await fs.writeFile('lib/product-types.json',JSON.stringify({source,verified:new Date().toISOString().slice(0,10),categories},null,2)+'\n');
console.log(`Imported ${categories.length} categories and ${categories.reduce((total,category)=>total+category.types.length,0)} product types from ${source}`);
