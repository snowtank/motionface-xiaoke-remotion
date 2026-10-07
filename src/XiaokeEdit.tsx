import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, cancelRender, continueRender, delayRender, Easing, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {Mascot, SceneArtwork} from './SceneArtwork';

const INK = '#2b2721';
const PAPER = '#f8f5ec';
const YELLOW = '#edc653';
const CORAL = '#cc6952';
const MINT = '#78bfae';
type Scene = 'city' | 'ramen' | 'cat' | 'dance';
type PreviewTransition = {kind: 'spin' | 'flip' | 'glitch'; progress: number; previous: Scene};
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const progress = (t: number, start: number, end: number) => clamp((t - start) / (end - start));
const ease = (v: number) => Easing.inOut(Easing.cubic)(clamp(v));
const mix = (a: number, b: number, v: number) => a + (b - a) * v;
const sceneNames = {city: '夜景.mp4', ramen: '拉面.mp4', cat: '柴犬.mov', dance: '小克蹦迪.mp4'};
const hand: React.CSSProperties = {fontFamily: 'WenKai, serif', color: INK};
const box: React.CSSProperties = {position: 'absolute', border: `3px solid ${INK}`, borderRadius: 17, background: '#fcfaf3'};

const Artwork = ({scene, frame, wide = false}: {scene: Scene; frame: number; wide?: boolean}) => (
  <div style={{position:'absolute',inset:0,overflow:'hidden'}}>
    <SceneArtwork scene={scene} frame={frame} thumbnail={wide}/>
  </div>
);

const Bubble = ({x,y,text,scale=1}: {x:number;y:number;text:string;scale?:number}) => (
  <div style={{...box,left:x,top:y,padding:'5px 18px',fontSize:25,whiteSpace:'nowrap',transform:`rotate(-3deg) scale(${scale})`,boxShadow:'3px 4px 0 #2b27211a'}}>{text}<div style={{position:'absolute',bottom:-10,left:22,width:18,height:18,background:'#fcfaf3',borderRight:`2px solid ${INK}`,borderBottom:`2px solid ${INK}`,transform:'skewY(28deg)'}}/></div>
);

const Comic = ({text,x,y,color=YELLOW,size=55,rotate=-6,scale=1}: {text:string;x:number;y:number;color?:string;size?:number;rotate?:number;scale?:number}) => (
  <div style={{position:'absolute',left:x,top:y,fontSize:size,fontWeight:900,color,WebkitTextStroke:`${Math.max(2,size*.09)}px ${INK}`,paintOrder:'stroke fill',letterSpacing:-2,whiteSpace:'nowrap',transform:`rotate(${rotate}deg) scale(${scale})`,textShadow:`3px 5px 0 ${INK}`}}>{text}</div>
);

const Phone = ({scene,frame,x=810,y=116,w=300,h=438,blur=false,text='',social=false,saturate=1,impact=0,transition}: {scene:Scene;frame:number;x?:number;y?:number;w?:number;h?:number;blur?:boolean;text?:string;social?:boolean;saturate?:number;impact?:number;transition?:PreviewTransition}) => (
  <div style={{position:'absolute',left:x,top:y,width:w,height:h,background:'#201e1a',borderRadius:w*.135,padding:w*.055,boxShadow:'5px 10px 0 #2b27212b, 0 12px 25px #2b272112'}}>
    <div style={{position:'absolute',left:-6,top:h*.22,width:7,height:h*.06,background:INK,borderRadius:3}}/><div style={{position:'absolute',left:-6,top:h*.32,width:7,height:h*.07,background:INK,borderRadius:3}}/><div style={{position:'absolute',right:-5,top:h*.28,width:7,height:h*.12,background:INK,borderRadius:3}}/>
    <div style={{position:'relative',width:'100%',height:'100%',overflow:'hidden',borderRadius:w*.09,background:'#323853'}}>
      {transition && <div style={{position:'absolute',inset:0,opacity:1-transition.progress,transform:transition.kind==='flip'?`perspective(600px) rotateY(${transition.progress*90}deg)`:`rotate(${-transition.progress*65}deg)`}}><Artwork scene={transition.previous} frame={frame}/></div>}
      <div style={{position:'absolute',inset:0,opacity:transition?Math.min(1,transition.progress*2):1,filter:`${blur ? 'grayscale(1) blur(6px)' : ''} saturate(${saturate})`,transform:transition ? transition.kind==='spin'?`rotate(${(1-transition.progress)*360}deg) scale(${.45+transition.progress*.55})`:transition.kind==='flip'?`perspective(600px) rotateY(${(1-transition.progress)*-90}deg)`:`translateX(${Math.sin(frame*3)*(1-transition.progress)*20}px)`:`scale(${1+impact})`}}><Artwork scene={scene} frame={frame}/></div>
      {blur && <><div style={{position:'absolute',inset:0,background:'#7779'}}/><div style={{position:'absolute',top:'29%',left:'39%',width:'22%',aspectRatio:1,border:'3px solid #eee',borderRightColor:'transparent',borderRadius:'50%',transform:`rotate(${frame*10}deg)`}}/><div style={{position:'absolute',top:'44%',width:'100%',textAlign:'center',color:'white',fontSize:23}}>对焦中</div><div style={{position:'absolute',inset:'13% 10% 9%',border:'3px dashed #eee7'}}/></>}
      {text && <Comic text={text} x={social?35:18} y={social?170:255} size={social?71:29} rotate={social?-8:-2}/>}
      {social && <><div style={{position:'absolute',right:18,top:80,color:'white',fontSize:17,textAlign:'center',textShadow:'1px 2px 0 #252125'}}><div style={{border:'3px solid white',background:'#d96855',borderRadius:'50%',fontSize:26,width:44,height:44,margin:'0 auto 24px'}}>··</div><span style={{color:'#f787a7',fontSize:48,WebkitTextStroke:'2px #362834'}}>♥</span><br/>{frame>855?'10.2w':'3.3w'}<div style={{fontSize:38,marginTop:12}}>▣</div>{frame>855?'2333':'717'}<div style={{fontSize:42,marginTop:13}}>➦</div>分享</div><div style={{position:'absolute',bottom:30,left:22,fontSize:24,color:'white',textShadow:'1px 2px 1px #222'}}>@小克 · Opus 5.5<div style={{fontSize:18,marginTop:8}}>#AI剪辑 #卡点 #code2video</div></div></>}
    </div>
    <div style={{position:'absolute',left:'43%',top:w*.085,width:'17%',height:w*.045,background:'#171714',borderRadius:12}}/>
    {!social && <div style={{position:'absolute',top:'100%',marginTop:8,width:'100%',left:0,textAlign:'center',fontFamily:'sans-serif',fontSize:23,color:'#5e5a50'}}>⏮ &nbsp; ⏸ &nbsp; ⏭</div>}
  </div>
);

const Library = ({t,frame}: {t:number;frame:number}) => {
  const active = t<8.7?0:t<11.7?1:2;
  const scenes: Scene[]=['city','ramen','cat','dance'];
  const effects=['旋转','翻页','故障','缩放','滑动','溶解'];
  return <div style={{...box,left:38,top:100,width:382,height:473,padding:16,opacity:progress(t,1.05,1.32)}}>
    <div style={{display:'flex',gap:10,height:39}}>{['素材','转场','文字'].map((s,i)=><div key={s} style={{flex:1,textAlign:'center',fontSize:26,lineHeight:'32px',background:i===active?YELLOW:'#efede4',border:`3px solid ${i===active?INK:'#99968b'}`,borderRadius:11,color:i===active?INK:'#99968b',boxShadow:i===active?'0 2px 0 '+INK:undefined}}>{s}</div>)}</div>
    {active===0 && <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px 14px',marginTop:13}}>{scenes.map((scene,i)=><div key={scene} style={{fontSize:21,textAlign:'center',opacity:progress(t,1.25+i*.08,1.5+i*.08)}}><div style={{height:95,position:'relative',border:`3px solid ${INK}`,borderRadius:11,overflow:'hidden'}}><Artwork scene={scene} frame={frame} wide/><span style={{position:'absolute',right:2,bottom:2,background:'#332d2799',borderRadius:5,color:'white',fontFamily:'sans-serif',fontSize:16,padding:'2px 4px'}}>{[2.4,4.6,2.4,2.8][i]}s</span></div>{sceneNames[scene]}</div>)}{[0,1].map(i=><div key={i} style={{opacity:.3,textAlign:'center',fontSize:19}}><div style={{height:90,border:'1px dashed #625f51',borderRadius:10,display:'grid',placeItems:'center',fontSize:42}}>+</div>导入素材</div>)}</div>}
    {active===1 && <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px 12px',marginTop:14}}>{effects.map((s,i)=><div key={s} style={{textAlign:'center',fontSize:22}}><div style={{border:`3px solid ${INK}`,borderRadius:12,height:94,display:'grid',placeItems:'center',background:['#dedbe9','#d2eee2','#f8d8e3','#d8ecf4','#f9ebbb','#ece7db'][i],fontFamily:'sans-serif',fontSize:46}}>{['◉','▤','▣','⊕','❯','▧'][i]}</div>{s}</div>)}</div>}
    {active===2 && <div style={{display:'flex',flexDirection:'column',gap:17,marginTop:14}}>{['前方高能','好耶～','霓虹 NEON'].map((s,i)=><div key={s} style={{height:111,border:`3px solid ${INK}`,borderRadius:12,background:['#fff6d2','#fce4eb','#2e233b'][i],position:'relative',display:'grid',placeItems:'center'}}><span style={{position:'absolute',top:6,left:12,fontSize:13,color:i===2?'#a39cac':'#aca798'}}>{['标题款','气泡','霓虹'][i]}</span>{i===0?<Comic text={s} x={65} y={31} size={31} rotate={0}/>:<span style={{fontSize:29,color:i===1?'#cb7593':'#fff',fontWeight:i===2?800:400,textShadow:i===2?'0 0 14px #cb93f8':undefined,border:i===1?'2px solid #cd84a0':undefined,borderRadius:40,padding:'2px 25px',background:i===1?'#fff8fb':undefined}}>{s}</span>}</div>)}</div>}
  </div>;
};

const controls = (t:number) => [t<16.3?0:mix(0,.7,ease(progress(t,16.3,16.9))),t<17? .46:t<17.7?mix(.46,1,progress(t,17,17.7)):mix(1,.44,ease(progress(t,17.9,18.5))),t<18.8?0:mix(0,.6,ease(progress(t,18.8,19.7))),.5];
const Adjustments = ({t}:{t:number}) => <div style={{...box,left:1498,top:100,width:382,height:473,padding:'19px 23px',opacity:progress(t,1.38,1.68)}}>
  <div style={{fontSize:31,fontWeight:700,paddingBottom:12,borderBottom:'3px solid #d1cdc1'}}>调整 <span style={{color:YELLOW,WebkitTextStroke:'1px '+INK}}>✦</span></div>
  {['闪光','饱和度','缩放冲击','速度'].map((s,i)=><div key={s} style={{height:91,paddingTop:11}}><div style={{display:'flex',justifyContent:'space-between',fontSize:24}}>{s}<span style={{fontSize:20,color:'#827d71'}}>{i===3?'1.0x':Math.round(controls(t)[i]*(i===1?250:100))+'%'}</span></div><div style={{position:'relative',height:12,background:'#e8e5dc',border:'1.5px solid '+INK,borderRadius:9,marginTop:17}}><div style={{height:'100%',width:controls(t)[i]*100+'%',borderRadius:9,background:t>17.3&&t<17.85&&i===1?'#ec573b':MINT}}/><div style={{position:'absolute',left:`calc(${controls(t)[i]*100}% - 14px)`,top:-10,width:28,height:28,border:'3px solid '+INK,borderRadius:'50%',background:'#fffdf5'}}><span style={{position:'absolute',inset:8,borderRadius:'50%',background:'#d8a7ad'}}/></div></div></div>)}
</div>;

const Clip = ({scene,frame,x,w,blur=false,opacity=1,rotation=0,y=725}:{scene:Scene;frame:number;x:number;w:number;blur?:boolean;opacity?:number;rotation?:number;y?:number}) => <div style={{position:'absolute',left:x,top:y,width:w,height:100,border:'3px solid '+INK,borderRadius:11,overflow:'hidden',opacity,transform:`rotate(${rotation}deg)`,background:'#e9e2cb'}}>
  <div style={{position:'absolute',inset:0,display:'flex',filter:blur?'grayscale(1) contrast(.35)':undefined}}>{Array.from({length:Math.max(1,Math.round(w/85))},(_,i)=><div key={i} style={{position:'relative',height:'100%',flex:1,overflow:'hidden'}}><Artwork scene={scene} frame={frame+i*9} wide/></div>)}</div>
  {blur && <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(-45deg,#2b272155 0px,#2b272155 2px,transparent 2px,transparent 9px)',display:'grid',placeItems:'center',fontSize:34,color:'#403d35'}}>◎</div>}
  <div style={{position:'absolute',left:6,top:5,padding:'1px 9px',borderRadius:7,background:'#fffef3dd',fontSize:17,whiteSpace:'nowrap'}}>{sceneNames[scene]}</div>
</div>;

const layout = (t:number) => {
  const trimmed=ease(progress(t,7.8,8.45));
  return {city:150,ramen:405,ramen2:mix(788,600,trimmed),cat:mix(892,704,trimmed),dance:mix(1148,960,trimmed),end:mix(1442,1254,trimmed),trimmed};
};
const playhead = (t:number) => interpolate(t,[0,4,5.8,7.3,8.4,9.2,11.7,15.6,16,20,23.7,30],[150,150,650,650,560,380,820,920,980,1070,1254,1254],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});

const Timeline = ({t,frame}:{t:number;frame:number}) => {
  const l=layout(t);
  const cut=t>=6.6;
  return <div style={{opacity:progress(t,1.55,1.9)}}>
    <div style={{...box,left:38,top:588,width:1842,height:465}}/>
    <svg width={1920} height={1080} style={{position:'absolute',inset:0}}>
      <path d="M126 648H1850" fill="none" stroke="#635e55" strokeWidth={3}/>
      {Array.from({length:33},(_,i)=><g key={i}><path d={`M${150+i*53.5} 648v-${i%4===0?20:i%2===0?11:6}`} stroke="#68645b" strokeWidth={i%4===0?3:1.3}/>{i%4===0&&<text x={150+i*53.5} y={624} textAnchor="middle" fill="#666056" fontSize={22}>0:{String(i/2).padStart(2,'0')}</text>}</g>)}
      <path d="M126 937H1850" stroke="#d7d2c7" strokeWidth={2} strokeDasharray="2 9"/>
    </svg>
    {[['T',661,51,'#fbf0c3'],['▶',725,100,'#d7f0e5'],['♪',841,60,'#e5ddef']].map(([s,y,h,c])=><div key={String(s)} style={{...box,left:57,top:Number(y),height:Number(h),width:62,borderRadius:10,background:String(c),display:'grid',placeItems:'center',fontFamily:'sans-serif',fontSize:28}}>{s}</div>)}
    {[661,725,841].map((y,i)=><div key={y} style={{position:'absolute',left:132,top:y,width:1718,height:[51,100,60][i],background:'#f0ede6',borderRadius:5}}/>)}
    {t>2.32&&<Clip scene="city" frame={frame} x={150} w={252} opacity={progress(t,2.32,2.64)}/>}
    {t>2.88&&<><Clip scene="ramen" frame={frame} x={l.ramen} w={cut?190:484} opacity={progress(t,2.88,3.2)}/>{!cut&&t>3.2&&<div style={{position:'absolute',left:597,top:728,width:192,height:94,background:'repeating-linear-gradient(-45deg,#49483b99 0,#49483b99 2px,#777464aa 2px,#777464aa 10px)',display:'grid',placeItems:'center',fontSize:38,color:'#454438'}}>◎</div>}{cut&&<Clip scene="ramen" frame={frame} x={l.ramen2} w={98}/>}</>}
    {t>3.42&&<Clip scene="cat" frame={frame} x={l.cat} w={252} opacity={progress(t,3.42,3.7)}/>}
    {t>3.9&&<Clip scene="dance" frame={frame} x={l.dance} w={294} opacity={progress(t,3.9,4.2)}/>}
    {t>6.6&&t<8.1&&<Clip scene="ramen" frame={frame} x={mix(598,850,ease(progress(t,7.45,8)))} y={mix(725,945,ease(progress(t,7.45,8)))} w={187} blur opacity={1-progress(t,7.8,8.1)} rotation={progress(t,7.45,8)*25}/>}
    {t>4.25 && <div style={{position:'absolute',left:150,top:841,width:t>21?1530:1700,height:60,border:'3px solid '+INK,borderRadius:9,background:'#ebe6f4',overflow:'hidden',opacity:progress(t,4.25,4.6)}}><svg viewBox="0 0 1700 60" width="100%" height="100%" preserveAspectRatio="none"><g stroke="#aa9bd1" strokeWidth={2.2}>{Array.from({length:440},(_,i)=>{const h=8+Math.abs(Math.sin(i*3.9)+Math.sin(i*.19))*15;return <path key={i} d={`M${i*4+3} ${33-h/2}v${h}`}/>;})}</g></svg><span style={{position:'absolute',left:5,top:2,padding:'0 9px',borderRadius:4,background:'#faf8f2dd',fontSize:16}}>♪ bgm_小克.wav</span></div>}
    {t>9.7&&[405,704,960].map((x,i)=><div key={x} style={{position:'absolute',left:x-19,top:757,width:36,height:36,border:'3px solid '+INK,borderRadius:'50%',background:['#d1ccea','#e0f1e5','#eed0e7'][i],fontFamily:'sans-serif',fontSize:22,textAlign:'center',opacity:progress(t,9.7+i*.35,10+i*.35)}}>{['◉','▤','▣'][i]}</div>)}
    {t>12.3&&<div style={{position:'absolute',left:704,top:679,width:252*progress(t,12.3,12.9),height:25,border:'3px solid '+INK,borderRadius:6,background:YELLOW,fontSize:16,whiteSpace:'nowrap',overflow:'hidden'}}>T {t<14.5?'前方高能预警警':'前方高能预警'}</div>}
    {t>20.9&&<><div style={{...box,left:1696,top:838,width:151,height:61,borderRadius:10,background:YELLOW,fontSize:26,textAlign:'center',lineHeight:'52px'}}>▼ 卡点</div><svg width={1920} height={1080} style={{position:'absolute',inset:0,pointerEvents:'none'}}>{Array.from({length:Math.floor(32*progress(t,21.65,22.2))},(_,i)=><path key={i} d={`M${143+i*53.5} 914h15l-7.5 12Z`} fill={YELLOW} stroke={INK} strokeWidth={1.4}/>)}</svg></>}
    <svg width={1920} height={1080} style={{position:'absolute',inset:0,pointerEvents:'none'}}><path d={`M${playhead(t)} 628V941`} stroke="#de5d54" strokeWidth={2.4}/><path d={`M${playhead(t)-11} 605h22v17l-11 11-11-11Z`} fill="#e3534d" stroke={INK} strokeWidth={2}/></svg>
    <div style={{position:'absolute',left:77,top:1002,color:'#b8b3a7',fontSize:23}}>− ───○──── +</div><div style={{position:'absolute',right:62,top:1005,color:'#b8b3a7',fontSize:17}}>片段 4 · 总时长 0:{t<8?'12.2':'10.4'}</div>
  </div>;
};

const cameraKeys = [
  [0,1,0,0],[1.6,1,0,0],[2.1,1.12,-15,-112],[5.6,1.12,-15,-112],
  [6.5,1.3,-30,-230],[7.5,1.3,-30,-230],[8.5,1.22,-8,-120],[10.8,1.22,-8,-120],
  [12.1,1.35,-245,-128],[15.5,1.35,-245,-128],[16.5,1.42,-780,-20],[19.7,1.42,-780,-20],
  [20.5,1.12,-110,-92],[23.2,1.12,-110,-92],[24,1.25,-540,-10],[25.6,1.25,-540,-10],[26.4,1,0,0],[30,1,0,0],
];
const camera = (t:number) => {
  const i=Math.max(0,cameraKeys.findIndex((k,index)=>index<cameraKeys.length-1&&t>=k[0]&&t<cameraKeys[index+1][0]));
  const a=cameraKeys[i],b=cameraKeys[i+1],p=ease(progress(t,a[0],b[0]));
  return [mix(a[1],b[1],p),mix(a[2],b[2],p),mix(a[3],b[3],p)];
};

const Puppet = ({t,frame}:{t:number;frame:number}) => {
  const px=interpolate(t,[0,1.7,2,13.7,14,15,16,20,22,23,24,25.7,26.5],[240,240,240,240,380,430,835,835,990,1130,1400,1400,1600],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const py= t>20&&t<23? 723:615;
  if(t>=26.55) return null;
  let end: [number,number] | null=null;
  let dragged:Scene|null=null;
  if(t>=2.05&&t<4.25){const i=Math.min(3,Math.floor((t-2.05)/.55));dragged=(['city','ramen','cat','dance'] as Scene[])[i];const p=progress(t,2.05+i*.55,2.48+i*.55);end=[mix(127+i%2*173,[270,520,930,1250][i],ease(p)),mix(180+Math.floor(i/2)*135,748,ease(p))];}
  if(t>=4.7&&t<5.2)end=[playhead(t),611];
  if(t>=6.2&&t<7.5)end=[interpolate(t,[6.2,6.65,7,7.5],[598,598,790,790]),820];
  if(t>=8.8&&t<10.9){const i=Math.min(2,Math.floor((t-8.8)/.7));const p=progress(t,8.8+i*.7,9.35+i*.7);end=[mix(120+i%2*170,[405,704,960][i],ease(p)),mix(203+Math.floor(i/2)*138,776,ease(p))];}
  if(t>=12&&t<12.8)end=[mix(220,810,ease(progress(t,12,12.8))),mix(224,690,ease(progress(t,12,12.8)))];
  if(t>=16.15&&t<20){let row=t<17?0:t<18.7?1:2;end=[1528+controls(t)[row]*327,100+136+row*91];}
  if(t>=21.1&&t<21.9)end=[1768,870];
  if(t>=23.7&&t<24.7)end=[1730,54];
  return <div style={{opacity:progress(t,1.8,2.02)}}>
    {end&&<svg width={1920} height={1080} style={{position:'absolute',inset:0,overflow:'visible'}}><path d={`M${px+23} ${py+28}Q${mix(px,end[0],.5)} ${mix(py,end[1],.5)+45} ${end[0]} ${end[1]}`} fill="none" stroke={INK} strokeWidth={17} strokeLinecap="round"/><path d={`M${px+23} ${py+28}Q${mix(px,end[0],.5)} ${mix(py,end[1],.5)+45} ${end[0]} ${end[1]}`} fill="none" stroke={CORAL} strokeWidth={11} strokeLinecap="round"/><circle cx={end[0]} cy={end[1]} r={9} fill={CORAL} stroke={INK} strokeWidth={2}/></svg>}
    {dragged&&end&&<div style={{...box,left:end[0]-73,top:end[1]-94,width:146,height:91,overflow:'hidden',transform:`rotate(${-12+Math.sin(frame*.15)*5}deg)`,boxShadow:'4px 7px 0 #28221733'}}><Artwork scene={dragged} frame={frame} wide/></div>}
    <div style={{position:'absolute',left:px-10,top:py-46+Math.sin(frame*.3)*(t>20&&t<23?6:1.2),width:160,height:130,transform:`rotate(${t>20&&t<23?Math.sin(frame*.3)*5:0}deg)`}}><Mascot frame={frame} pose={t>15.7?'cool':t>5.5&&t<8.5||t>14&&t<15.5?'angry':'idle'}/></div>
    {t>1.98&&t<2.5&&<Bubble x={px+35} y={py-86} text="开工！"/>}
    {t>5.85&&t<6.5&&<Bubble x={px+118} y={py+2} text="这段先剪掉…"/>}
    {t>6.4&&t<7.5&&<><Comic text="唰！" x={565} y={558} color="#f3a7c8" size={58}/><Comic text="唰！" x={790} y={560} color="#f3a7c8" size={58} rotate={5}/></>}
    {t>7.45&&t<8.5&&<><svg style={{position:'absolute',left:882,top:852,width:72,height:91}} viewBox='0 0 72 91'><path d='M10 17H62L57 83Q36 90 15 83Z' fill='#9da3a4' stroke={INK} strokeWidth='3'/><path d='M7 13Q36 4 65 13V20H7Z' fill='#b8bdbe' stroke={INK} strokeWidth='3'/><path d='M26 10V5H46V10M22 28L25 79M36 28V81M50 28L47 79' fill='none' stroke='#585d5e' strokeWidth='2'/></svg><Comic text="哐当！" x={967} y={892} size={31}/></>}
    {t>8.9&&t<9.55&&<Bubble x={px+37} y={py-94} text="转起来！"/>}
    {t>10.3&&t<11.2&&<Comic text="丝滑入戏！" x={471} y={515} size={32} color={MINT}/>}
    {t>14&&t<15.65&&<><div style={{...box,left:px-29,top:py+58,width:232,height:130,borderRadius:18,boxShadow:'0 8px 0 #b2ada2',display:'grid',placeItems:'center',fontFamily:'sans-serif',fontSize:53,fontWeight:900}}>Ctrl+Z</div><Comic text="撤销！" x={484} y={525} color={MINT} size={43}/></>}
    {t>14.85&&t<16&&<div style={{position:'absolute',left:1162,top:326,border:'3px double #6caa84',padding:'4px 15px',borderRadius:10,fontSize:42,fontWeight:700,color:'#6caa84',transform:'rotate(-9deg)'}}>已修正</div>}
    {t>17.15&&t<17.85&&<Comic text="饱和度拉满" x={1130} y={115} color="#f259a3" size={36}/>}
    {t>21.7&&t<22.6&&<Comic text="卡点！" x={495} y={816} color={MINT} size={34}/>}
  </div>;
};

const Header = ({t}:{t:number}) => <div style={{...box,left:40,top:22,width:1840,height:63,borderRadius:16,display:'flex',alignItems:'center',padding:'0 16px',background:'#fffdf6',boxShadow:'0 3px 0 '+INK}}>
  <div style={{display:'flex',gap:9,marginRight:25}}>{['#dc6158','#edc75d','#7ebb8c'].map(c=><div key={c} style={{width:14,height:14,borderRadius:'50%',background:c,border:'1.5px solid '+INK}}/>)}</div><span style={{display:'block',width:39,height:43,marginRight:13}}><Mascot pose='idle'/></span><span style={{fontSize:29}}>小克剪辑_最终版_打死不改(3).mp4</span>
  <div style={{position:'absolute',left:809,top:5,background:INK,borderRadius:10,width:223,height:49,color:'white',fontSize:30,textAlign:'center',paddingTop:5,fontVariantNumeric:'tabular-nums'}}>00:00:{String(Math.floor(t)).padStart(2,'0')}:{String(Math.floor(t*30)%30).padStart(2,'0')}</div>
  <span style={{position:'absolute',left:1052,color:'#aaa598',fontSize:21}}>· 已自动保存</span><span style={{position:'absolute',right:299,border:'3px solid '+INK,borderRadius:11,padding:'3px 12px',fontSize:24,background:'#eeeadd'}}>1080p</span>
  <div style={{position:'absolute',right:15,top:5,width:267,height:49,border:'3px solid '+INK,borderRadius:12,boxShadow:'0 5px 0 '+INK,textAlign:'center',fontSize:28,fontWeight:700,lineHeight:'42px',color:t<24?'white':INK,background:t<24?MINT:t<26?'repeating-linear-gradient(-45deg,#f4d16a 0,#f4d16a 13px,#f0c650 13px,#f0c650 24px)':'#8bcc94'}}>{t<24?'⬆ 导出':t<25?'渲染中 '+Math.round(progress(t,24,25)*99)+'%':t<26?'渲染中 99%':'完成 ✓'}</div>
</div>;

const Terminal = ({t}:{t:number}) => {
  const lines=['const 剪辑软件 = 小克.导代码()', '剪辑软件.点击(时间轴, 转场, 音效)', '小克.开始剪辑()'];
  return <AbsoluteFill style={{background:'#f1eee5',display:'grid',placeItems:'center'}}><div style={{...box,position:'relative',width:982,height:302,background:'#fffdf7',boxShadow:'4px 7px 0 #c8c3b8',transform:`scale(${mix(1,1.04,progress(t,0,.75))})`}}><div style={{height:45,borderBottom:'3px solid '+INK,background:'#eeeadf',borderRadius:'13px 13px 0 0',textAlign:'center',color:'#a19a8c',fontSize:22,paddingTop:8}}>小克.js — 终端<div style={{position:'absolute',left:22,top:15,display:'flex',gap:8}}>{['#df625a',YELLOW,'#79b783'].map(c=><i key={c} style={{background:c,width:14,height:14,border:'1.5px solid '+INK,borderRadius:'50%'}}/>)}</div></div><div style={{padding:'33px 35px',fontSize:31,lineHeight:1.8}}>{lines.map((s,i)=><div key={s}><span style={{display:'inline-block',width:53,color:'#bbb5a9',fontSize:25}}>{i+1}</span><span style={{color:['#55a990','#74b19c','#d16a52'][i]}}>{s.slice(0,Math.floor(progress(t,i*.21,i*.21+.23)*s.length))}</span>{t>=i*.21&&t<(i+1)*.21&&<span style={{color:'#d25d4f'}}>▎</span>}</div>)}</div></div></AbsoluteFill>;
};

export const XiaokeEdit = () => {
  const frame=useCurrentFrame();const t=frame/30;
  const [fontHandle]=useState(()=>delayRender('Load the bundled WenKai font'));
  useEffect(()=>{let alive=true; const font=new FontFace('WenKai',`url("${staticFile('fonts/LXGWWenKai-Regular.ttf')}")`);font.load().then(f=>{document.fonts.add(f);if(alive)continueRender(fontHandle);}).catch(error=>cancelRender(error));return()=>{alive=false;};},[fontHandle]);
  const [s,tx,ty]=camera(t);
  const scene:Scene=t<5.35?'city':t>9.35&&t<9.7?'city':t<10.7?'ramen':t<15.65?'cat':t<16.2?'city':'dance';
  const blur=t>5.85&&t<7.8;
  const transition:PreviewTransition|undefined=t>=9.7&&t<10.1?{kind:'spin',progress:progress(t,9.7,10.1),previous:'city'}:t>=10.7&&t<11.1?{kind:'flip',progress:progress(t,10.7,11.1),previous:'ramen'}:t>=16.2&&t<16.5?{kind:'glitch',progress:progress(t,16.2,16.5),previous:'city'}:undefined;
  const warning=t>12.65&&t<15.7?'前方高能预警'.slice(0,Math.min(7,Math.floor((t-12.65)*10)))+(t>13.65&&t<14.55?'警':''):t>22&&t<24?'前方高能预警':'';
  const finalIn=spring({frame:frame-800,fps:30,config:{damping:18,stiffness:125}});
  const finalScene:Scene=t<27.3?'city':t<27.7?'ramen':t<28.25?'cat':'dance';
  return <AbsoluteFill style={{...hand,background:PAPER,overflow:'hidden'}}>
    <Audio src={staticFile('audio/editor-foley.m4a')}/>
    <div style={{position:'absolute',width:1920,height:1080,transformOrigin:'0 0',transform:`translate(${tx}px, ${ty}px) scale(${s})`,opacity:t>=26.55?mix(1,.32,progress(t,26.55,27)):1}}>
      <div style={{...box,left:18,top:8,width:1884,height:1062,background:PAPER,borderRadius:22}}/><Header t={t}/><Library t={t} frame={frame}/><Adjustments t={t}/>
      {t>1.2&&<div style={{opacity:progress(t,1.2,1.55)*(1-progress(t,26.3,26.7))}}><Phone scene={scene} frame={frame} transition={transition} blur={blur} text={warning} saturate={t>17.2&&t<18?2.4:1} impact={t>19&&t<20?.014*(1+Math.sin(frame*.6)):0}/></div>}
      <Timeline t={t} frame={frame}/><Puppet t={t} frame={frame}/>
    </div>
    {t<.86&&<Terminal t={t}/>}
    {t>=.86&&t<1.02&&<AbsoluteFill style={{background:PAPER,opacity:1-progress(t,.86,1.02)}}/>}
    {t>26.55&&<div style={{position:'absolute',inset:0,opacity:clamp(finalIn),transform:`translateY(${(1-finalIn)*120}px)`}}>
      <div style={{...box,left:67,top:250,width:546,height:488,borderRadius:8,transform:'rotate(-1.5deg)',boxShadow:'6px 8px 0 #2b27212a',background:'repeating-linear-gradient(#fffdf6 0,#fffdf6 61px,#eaded2 62px,#fffdf6 63px)',padding:'48px 40px'}}><div style={{position:'absolute',left:192,top:-17,width:145,height:34,background:'#edc650cc',transform:'rotate(-3deg)'}}/><div style={{fontSize:40,height:140}}>{'30 秒剪完，'.slice(0,Math.floor(progress(t,27,27.5)*7))}</div><div style={{fontSize:79,fontWeight:700,letterSpacing:7,whiteSpace:'nowrap'}}>{'Opus 5.5'.slice(0,Math.floor(progress(t,27.55,28.55)*8))}</div>{t>28.4&&<div style={{height:7,width:450*progress(t,28.4,28.7),background:'#d75c48',borderRadius:'50%',marginTop:20,transform:'rotate(-1deg)'}}/>}<div style={{position:'absolute',right:34,bottom:35,fontSize:23,opacity:progress(t,28.6,29)}}>— 小克</div></div>
      <Phone scene={finalScene} frame={frame} x={676} y={198} w={450} h={685} social text={t>28.65?'拿捏了！':''}/>
      <div style={{position:'absolute',left:1415,top:658,width:250,height:228,transform:`translateY(${Math.sin(frame*.2)*8}px)`}}><Mascot frame={frame} pose="cool"/></div>
      {t<27.5&&<Comic text="叮！" x={1360} y={150} color={MINT} size={52}/>}
      <svg width={1920} height={1080} style={{position:'absolute',inset:0}}>{Array.from({length:54},(_,i)=>{const p=progress(t,26.6+i%7*.05,30);const x=1200+Math.sin(i*7.1)*600+p*Math.cos(i*5)*160;const y=-60+p*(600+(i%6)*95);return <rect key={i} x={x} y={y} width={5+i%3*2} height={12} fill={['#e6c44f','#dd8396','#74b7a3','#917bc5'][i%4]} transform={`rotate(${i*23+p*210} ${x} ${y})`} opacity={.8}/>;})}</svg>
    </div>}
  </AbsoluteFill>;
};
