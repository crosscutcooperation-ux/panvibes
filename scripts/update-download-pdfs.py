from pathlib import Path
import io,json,subprocess
import pymupdf as fitz
import numpy as np
from PIL import Image,ImageOps
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from xml.sax.saxutils import escape

ROOT=Path(__file__).resolve().parents[1]
WORK=ROOT/'tmp/pdfs';WORK.mkdir(parents=True,exist_ok=True)
W,H=595.2756,841.8898
BLUE='#0d3553';ORANGE='#fa6538';MUTED='#5e7c97'
LOGO=ROOT/'public/images/panvibes-logo-transparent.png'
SOURCE_COMMIT='d4a3eaa291acb060525bf57ee6acc69d323c6277'
names=['PanVibes-Exim-Premium-Brochure-Short','PanVibes-Exim-Premium-Company-Profile']

def original(name):
 data=subprocess.check_output(['git','show',f'{SOURCE_COMMIT}:public/documents/{name}.pdf'],cwd=ROOT)
 return fitz.open(stream=data,filetype='pdf')

# Project the transparent brand onto the real long wall. No rectangular backing,
# no changes to the cab, doors, photograph crop or surrounding landscape.
source=original(names[0]);last=source[-1]
truck=next(i for i in last.get_image_info(xrefs=True) if i['width']==1512 and i['height']==559)
photo=Image.open(io.BytesIO(source.extract_image(truck['xref'])['image'])).convert('RGBA')
logo=Image.open(LOGO).convert('RGBA')
tl=np.array([211.,170.]);tr=np.array([662.,70.]);br=np.array([661.,366.]);bl=np.array([209.,374.])
def face(u,v):return tuple((1-v)*((1-u)*tl+u*tr)+v*((1-u)*bl+u*br))
quad=[face(.18,.34),face(.82,.34),face(.82,.72),face(.18,.72)]
coords=[(0,0),(logo.width,0),(logo.width,logo.height),(0,logo.height)]
a=[];b=[]
for (x,y),(u,v) in zip(quad,coords):
 a.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]]);b.extend([u,v])
coeff=np.linalg.solve(np.array(a),np.array(b))
paint=logo.transform(photo.size,Image.Transform.PERSPECTIVE,coeff,Image.Resampling.BICUBIC)
# The steel ribs retain their light and shade through the ink.
ink=np.array(paint,dtype=np.float32);steel=np.array(photo.convert('RGB'),dtype=np.float32).mean(axis=2)
ink[:,:,:3]*=(.82+.18*steel/255)[:,:,None];ink[:,:,3]*=.94
branded=Image.alpha_composite(photo,Image.fromarray(ink.astype('uint8'))).convert('RGB')
branded.save(WORK/'truck-branded.jpg',quality=95)

pdfmetrics.registerFont(TTFont('Catalogue','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('CatalogueBold','C:/Windows/Fonts/arialbd.ttf'))
body=ParagraphStyle('body',fontName='Catalogue',fontSize=8.7,leading=12.7,textColor=HexColor(BLUE))
small=ParagraphStyle('small',parent=body,fontSize=7.1,leading=10)
def paragraph(c,text,x,top,width,style=body):
 p=Paragraph(escape(text.translate(str.maketrans('₀₁₂₃₄₅₆₇₈₉','0123456789'))),style);_,h=p.wrap(width,700);p.drawOn(c,x,H-top-h);return h

def header(c,title,sub,number):
 c.drawImage(str(LOGO),40,H-73,140,51,mask='auto')
 c.setFillColor(HexColor(MUTED));c.setFont('CatalogueBold',6.5);c.drawRightString(W-40,H-37,'PRODUCT BROCHURE')
 c.setFont('Catalogue',5.8);c.drawRightString(W-40,H-51,'GLOBAL EXPORT IMPORT ORGANIZATION')
 c.setFillColor(HexColor(ORANGE));c.setFont('CatalogueBold',7);c.drawString(40,H-112,sub)
 c.setFillColor(HexColor(BLUE));c.setFont('Times-Bold',27);c.drawString(40,H-150,title)
 c.setFillColor(HexColor(MUTED));c.setFont('Catalogue',8.2);c.drawString(40,H-169,'Products listed in the current PanVibes website catalogue.')
 c.setStrokeColor(HexColor('#d6e2eb'));c.line(40,47,W-40,47)
 c.setFillColor(HexColor(BLUE));c.setFont('CatalogueBold',6.7);c.drawString(40,30,'PANVIBES EXIM')
 c.setFont('Catalogue',6.7);c.drawString(178,30,'CURRENT PRODUCT CATALOGUE');c.drawRightString(W-40,30,f'{number:02d} / 07')

def card(c,x,top,w,h,title,text,style=body):
 c.setFillColor(HexColor('#f3f7fb'));c.setStrokeColor(HexColor('#d9e4ed'));c.roundRect(x,H-top-h,w,h,5,fill=1,stroke=1)
 c.setFillColor(HexColor(ORANGE));c.rect(x+13,H-top-18,18,2,fill=1,stroke=0)
 c.setFillColor(HexColor(BLUE));title_size=min(10.5,10.5*(w-26)/max(1,pdfmetrics.stringWidth(title,'CatalogueBold',10.5)));c.setFont('CatalogueBold',title_size);c.drawString(x+13,H-top-37,title)
 used=paragraph(c,text,x+13,top+49,w-26,style)
 assert used<=h-59,(title,used,h)

catalogue=json.loads((ROOT/'lib/product-types.json').read_text(encoding='utf-8'))['categories']
chemicals=json.loads((ROOT/'lib/chemicals.json').read_text(encoding='utf-8'))['groups']
buffer=io.BytesIO();c=canvas.Canvas(buffer,pagesize=(W,H))
header(c,'Food & nutrition','PRODUCT CATALOGUE / 01',4)
food=[x for x in catalogue if x['key'] not in ['industrial-chemicals','stone','admixtures']]
for i,item in enumerate(food):
 title={'Makhana':'Makhana & healthy food snacks','Vegetables (Dehydrated)':'Dehydrated vegetables','Fruits (Dehydrated)':'Dehydrated fruits'}.get(item['title'],item['title'])
 card(c,40+(i%2)*264,192+(i//2)*128,251,116,title,' / '.join(t['name'] for t in item['types']))
paragraph(c,'Makhana size grades support hand-picked and non-hand-picked enquiries. Vegetable forms and product-specific grades are confirmed against your requirement.',40,724,W-80,small)
paragraph(c,'Shipping only to India, UK, USA, Europe and UAE. Share the product, quantity, grade and delivery location for a quotation.',40,753,W-80,small)
c.showPage();header(c,'Industrial products','PRODUCT CATALOGUE / 02',5)
industrial=[x for x in catalogue if x['key'] in ['stone','admixtures']]
for i,item in enumerate(industrial):card(c,40+i*264,192,251,116,item['title'],' / '.join(t['name'] for t in item['types']),small)
c.setFillColor(HexColor(BLUE));c.setFont('CatalogueBold',12);c.drawString(40,H-337,'Chemicals - 51 listings across 9 groups')
for i,g in enumerate(chemicals[:4]):
 card(c,40+(i%2)*264,352+(i//2)*143,251,131,g['name'],' / '.join(g['products']))
paragraph(c,'For chemicals, specify grade, purity or concentration, required quantity, application and destination. Request specifications and SDS/MSDS where applicable.',40,702,W-80,small)
c.showPage();header(c,'Chemical directory','PRODUCT CATALOGUE / 03',6)
for i,g in enumerate(chemicals[4:]):
 card(c,40+(i%2)*264,192+(i//2)*151,251,139,g['name'],' / '.join(g['products']))
paragraph(c,'This directory lists the chemical products available for sourcing enquiries on our website. Specifications, availability and the documentation covering each product or lot are confirmed by the team.',40,702,W-80,small)
paragraph(c,'Shipping only to India, UK, USA, Europe and UAE. For Europe, include the delivery country and city.',40,737,W-80,small)
c.save();product_pages=fitz.open(stream=buffer.getvalue(),filetype='pdf')

for name in names:
 d=original(name)
 last=d[-1];entry=next(i for i in last.get_image_info(xrefs=True) if i['width']==1512 and i['height']==559)
 last.replace_image(entry['xref'],filename=str(WORK/'truck-branded.jpg'))
 if 'Brochure' in name:
  cover=d[0];photo_entry=next(i for i in cover.get_image_info(xrefs=True) if i['width']>700)
  new_photo=ImageOps.fit(Image.open(ROOT/'public/images/photos/vegetables.webp').convert('RGB'),(photo_entry['width'],photo_entry['height']),method=Image.Resampling.LANCZOS,centering=(.45,.50))
  image_buffer=io.BytesIO();new_photo.save(image_buffer,format='JPEG',quality=95)
  cover.replace_image(photo_entry['xref'],stream=image_buffer.getvalue())
  updated=fitz.open();updated.insert_pdf(d,from_page=0,to_page=2);updated.insert_pdf(product_pages);updated.insert_pdf(d,from_page=7,to_page=7)
  for i in [1,2]:
   page=updated[i];old=f'{i+1:02d} / 08'
   for rect in page.search_for(old):
    page.add_redact_annot(rect,fill=(1,1,1));page.apply_redactions(images=0,graphics=0)
    page.insert_text((rect.x0,rect.y1-1.3),f'{i+1:02d} / 07',fontname='helv',fontsize=7,color=(.05,.21,.33))
  d=updated
 if 'Company-Profile' in name:
  # Keep the dry-fruit illustration consistent with the cashew-only website photo.
  ingredients=d[4]
  cashew=next(i for i in ingredients.get_image_info(xrefs=True) if i['bbox'][0]>300 and i['bbox'][1]>630)
  image=ImageOps.fit(Image.open(ROOT/'public/images/photos/cashews.webp').convert('RGB'),(cashew['width'],cashew['height']),method=Image.Resampling.LANCZOS)
  image_buffer=io.BytesIO();image.save(image_buffer,format='JPEG',quality=95)
  ingredients.replace_image(cashew['xref'],stream=image_buffer.getvalue())
  spice=next(i for i in ingredients.get_image_info(xrefs=True) if i['bbox'][0]<100 and 500<i['bbox'][1]<630)
  image=ImageOps.fit(Image.open(ROOT/'public/images/photos/ginger-turmeric.webp').convert('RGB'),(spice['width'],spice['height']),method=Image.Resampling.LANCZOS)
  image_buffer=io.BytesIO();image.save(image_buffer,format='JPEG',quality=95)
  ingredients.replace_image(spice['xref'],stream=image_buffer.getvalue())
  for page in d:
   page.wrap_contents()
   page.draw_rect(fitz.Rect(39,21,181,74),color=None,fill=(1,1,1),overlay=True)
   page.insert_image(fitz.Rect(40,22,180,73.3725),filename=str(LOGO),overlay=True)
 target=ROOT/'public/documents'/f'{name}.pdf'
 d.save(target,garbage=4,deflate=True)
 # Every final page is rendered for review, including the retained pages.
 for i,p in enumerate(d):p.get_pixmap(matrix=fitz.Matrix(1.1,1.1)).save(str(WORK/f'{name}-final-{i+1}.png'))
 print(name,'updated:',len(d),'pages')
 if 'Brochure' in name:
  text='\n'.join(p.get_text() for p in d).lower()
  for removed in ['milkshake','tea premix','coffee premix','margarita','soup powder','diet beverages','instant drinks','vanilla','saffron']:
   assert removed not in text,removed
  for expected in ['banana powder','moringa powder','ashwagandha','construction admixtures','sodium hydroxide']:
   assert expected in text,expected
