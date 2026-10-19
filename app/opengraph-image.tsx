import { ImageResponse } from 'next/og';
export const alt = 'PanVibes Exim — B2B food ingredients for India, UK, USA, Europe and UAE';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'65px 75px', background:'#104e87', color:'white' }}>
    <div style={{ display:'flex', fontSize:28, letterSpacing:3 }}>PANVIBES EXIM</div>
    <div style={{ display:'flex', flexDirection:'column', fontSize:66, lineHeight:1.1 }}><span>Food ingredients.</span><span style={{ color:'#ff896f' }}>India. UK. USA. Europe. UAE.</span></div>
    <div style={{ display:'flex', fontSize:23, color:'#d3e5f3' }}>Ginger · Turmeric · Moringa · Makhana · Dehydrated produce</div>
    <div style={{ display:'flex', fontSize:21 }}>B2B SOURCING / EXPORT SUPPORT / panvibesexim.com</div>
  </div>, size);
}
