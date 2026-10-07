import React, {useId} from 'react';

type Scene = 'city' | 'ramen' | 'cat' | 'dance';
type Pose = 'idle' | 'happy' | 'cool' | 'angry';

const ink = '#302b26';
const fraction = (value: number) => {
  const n = Math.sin(value * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
};

function Sparkle({x, y, size = 5, color = '#fff9dc', opacity = 1}: {
  x: number; y: number; size?: number; color?: string; opacity?: number;
}) {
  return <path d={`M ${x} ${y - size} Q ${x + 1} ${y - 1} ${x + size} ${y} Q ${x + 1} ${y + 1} ${x} ${y + size} Q ${x - 1} ${y + 1} ${x - size} ${y} Q ${x - 1} ${y - 1} ${x} ${y - size}`} fill={color} opacity={opacity}/>;
}

/** The same little editor can be placed over the UI and inside the dance clip. */
export function Mascot({frame = 0, pose = 'idle'}: {frame?: number; pose?: Pose}) {
  const bounce = pose === 'happy' ? Math.sin(frame * 0.18) * 2 : 0;
  const wave = Math.sin(frame * 0.14) * 5;
  return <svg viewBox="0 0 160 130" width="100%" height="100%" overflow="visible" aria-label="小克">
    <g transform={`translate(0 ${bounce})`} stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <g fill="#c6614b">
        <path d="M 36 99 L 36 124 L 47 124 L 47 100 M 51 99 L 51 124 L 62 124 L 62 100"/>
        <path d="M 103 99 L 103 124 L 114 124 L 114 100 M 118 99 L 118 124 L 129 124 L 129 100"/>
        {pose === 'happy' ? <>
          <path d={`M 31 70 Q 12 66 8 ${34 + wave}`} fill="none" strokeWidth="9"/>
          <path d={`M 31 70 Q 12 66 8 ${34 + wave}`} fill="none" stroke="#d37655" strokeWidth="5"/>
          <circle cx="8" cy={31 + wave} r="7"/>
          <path d={`M 130 70 Q 149 64 152 ${33 - wave}`} fill="none" strokeWidth="9"/>
          <path d={`M 130 70 Q 149 64 152 ${33 - wave}`} fill="none" stroke="#d37655" strokeWidth="5"/>
          <circle cx="152" cy={30 - wave} r="7"/>
        </> : <>
          <path d="M 29 62 L 18 62 Q 15 62 15 65 L 15 77 Q 15 80 19 80 L 30 79 Z"/>
          <path d="M 132 61 L 143 61 Q 146 61 146 65 L 146 77 Q 146 80 142 80 L 132 79 Z"/>
        </>}
        <path d="M 36 27 Q 30 28 29 35 L 30 96 Q 31 103 38 103 L 123 103 Q 132 102 133 94 L 132 36 Q 131 28 123 28 Z" fill="#ce6b54"/>
      </g>
      <path d="M 38 34 L 60 34" fill="none" stroke="#eba18a" strokeWidth="3" opacity="0.85"/>
      {pose === 'cool' ? <g fill="#211b19" strokeWidth="2.8">
        <path d="M 48 45 L 80 45 Q 79 66 63 64 Q 48 62 48 45 Z"/>
        <path d="M 84 45 L 117 45 Q 115 66 101 64 Q 84 64 84 45 Z"/>
        <path d="M 79 49 Q 83 46 87 49" fill="none"/>
        <path d="M 54 48 L 61 48 M 90 48 L 97 48" stroke="#fff9e8" strokeWidth="1.5"/>
      </g> : pose === 'happy' ? <g fill="none" strokeWidth="2.7">
        <path d="M 61 65 Q 67 57 73 65"/><path d="M 93 65 Q 99 57 105 65"/>
      </g> : pose === 'angry' ? <g strokeWidth="4.8">
        <path d="M 61 50 L 73 54 M 95 54 L 107 50"/>
      </g> : <g stroke="none" fill="#26201c">
        <ellipse cx="62" cy="52" rx="3.7" ry="6.7"/><ellipse cx="100" cy="52" rx="3.7" ry="6.7"/>
        <circle cx="61" cy="49" r="1.25" fill="#fff6e2"/><circle cx="99" cy="49" r="1.25" fill="#fff6e2"/>
      </g>}
      {(pose === 'happy' || pose === 'cool') && <g stroke="none" fill="#e68678" opacity="0.75">
        <ellipse cx="58" cy="73" rx="7" ry="3.6"/><ellipse cx="110" cy="73" rx="7" ry="3.6"/>
      </g>}
    </g>
  </svg>;
}

function City({id, frame, thumbnail = false}: {id: string; frame: number; thumbnail?: boolean}) {
  const towers = [
    {x: -8, y: 220, w: 28, h: 204}, {x: 9, y: 222, w: 36, h: 201},
    {x: 44, y: 203, w: 34, h: 220}, {x: 77, y: 223, w: 32, h: 199},
    {x: 109, y: 240, w: 24, h: 185}, {x: 132, y: 211, w: 29, h: 211},
    {x: 163, y: 214, w: 30, h: 208}, {x: 192, y: 207, w: 30, h: 215},
    {x: 222, y: 212, w: 28, h: 212},
  ];
  const fronts = [
    {x: -3, y: 278, w: 41}, {x: 37, y: 264, w: 36}, {x: 72, y: 250, w: 37},
    {x: 109, y: 249, w: 35}, {x: 143, y: 263, w: 33}, {x: 176, y: 278, w: 37}, {x: 212, y: 261, w: 36},
  ];
  return <>
    <defs>
      <linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#444968"/><stop offset="0.52" stopColor="#474f87"/><stop offset="1" stopColor="#aa7196"/></linearGradient>
      <radialGradient id={`${id}-moonGlow`}><stop stopColor="#f7e0a0" stopOpacity="0.24"/><stop offset="1" stopColor="#e5dcaf" stopOpacity="0"/></radialGradient>
    </defs>
    <rect width="240" height={thumbnail ? 140 : 420} fill={`url(#${id}-sky)`}/>
    <circle cx="172" cy={thumbnail ? 45 : 100} r={thumbnail ? 36 : 58} fill={`url(#${id}-moonGlow)`}/>
    {Array.from({length: 51}, (_, i) => <circle key={i} cx={fraction(i + 1) * 235} cy={fraction(i + 63) * (thumbnail ? 95 : 282)} r={0.5 + fraction(i + 302) * 0.8} fill="#ede8f5" opacity={0.15 + (Math.sin(frame / 15 + i) + 1) * 0.25}/>)}
    <g transform={`${thumbnail ? 'translate(57 -23) scale(.68)' : ''} translate(0 ${Math.sin(frame / 42) * 1.2})`}>
      <path d="M 168 70 C 141 77 139 105 158 120 C 174 133 194 126 202 111 C 180 120 155 97 168 70 Z" fill="#ebc954" stroke={ink} strokeWidth="2.5"/>
      <path d="M 152 96 Q 157 102 162 97" fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="156" cy="104" rx="4" ry="2.4" fill="#e9a68d"/>
    </g>
    {[{x: 54, y: 121, s: 5}, {x: 160, y: 192, s: 7}, {x: 68, y: 149, s: 5}, {x: 99, y: 96, s: 3}, {x: 190, y: 53, s: 3}].map((star, i) => <Sparkle key={i} x={star.x} y={star.y * (thumbnail ? 0.35 : 1)} size={star.s * (thumbnail ? 0.65 : 1)} color={i === 2 ? '#d5be64' : '#f4edff'} opacity={0.5 + 0.4 * Math.sin(frame / 19 + i) ** 2}/>)}
    <g stroke={ink} strokeWidth="2.3" strokeLinejoin="round" transform={thumbnail ? 'translate(0 -140)' : undefined}>
      <path d="M 54 204 L 54 195 L 67 195 L 67 205 M 171 215 L 171 202 L 182 202 L 182 215" fill="#454972"/>
      {towers.map((b, i) => <g key={i}>
        <path d={`M ${b.x} ${b.y + b.h} L ${b.x} ${b.y + 2} Q ${b.x + 1} ${b.y} ${b.x + 4} ${b.y} L ${b.x + b.w - 2} ${b.y + 1} L ${b.x + b.w} ${b.y + b.h} Z`} fill={['#4c507b', '#4c527e', '#4e507b'][i % 3]}/>
        {Array.from({length: 8}, (_, j) => <rect key={j} x={b.x + 9 + (j % 2) * 12} y={b.y + 13 + Math.floor(j / 2) * 29} width="5" height="7" fill={fraction(i * 12 + j) > 0.72 ? '#afae79' : '#535780'} stroke="none" opacity="0.8"/>)}
      </g>)}
      <path d="M 120 245 L 120 224 M 116 233 L 124 233" fill="none"/>
      <circle cx="120" cy="220" r="4" fill="#e76479" stroke="none" opacity="0.28"/>
      <circle cx="120" cy="221" r="1.7" fill="#e86f7b" stroke="none"/>
      <g transform={thumbnail ? 'translate(0 -33)' : undefined}>
      {fronts.map((b, i) => <g key={i}>
        <path d={`M ${b.x} 423 L ${b.x} ${b.y + 3} Q ${b.x} ${b.y} ${b.x + 4} ${b.y} L ${b.x + b.w - 3} ${b.y + 1} Q ${b.x + b.w} ${b.y + 1} ${b.x + b.w} ${b.y + 4} L ${b.x + b.w} 423 Z`} fill={['#363d64', '#3d456e', '#3b4269'][i % 3]}/>
        {Array.from({length: 26}, (_, j) => <rect key={j} x={b.x + 7 + (j % 2) * 11} y={b.y + 12 + Math.floor(j / 2) * 13} width="5.3" height="6.5" fill={fraction(i * 41 + j) > 0.53 ? '#e7c95b' : '#454b76'} stroke="none"/>)}
      </g>)}
      </g>
    </g>
  </>;
}

function Ramen({id, frame, thumbnail = false}: {id: string; frame: number; thumbnail?: boolean}) {
  const noodleMove = Math.sin(frame / 16) * 1.5;
  return <>
    <defs><linearGradient id={`${id}-ramen`} x2="0" y2="1"><stop stopColor="#f6e9ac"/><stop offset="1" stopColor="#e8ce84"/></linearGradient></defs>
    <rect width="240" height={thumbnail ? 140 : 420} fill={`url(#${id}-ramen)`}/>
    {Array.from({length: 30}, (_, i) => <circle key={i} cx={fraction(i + 200) * 240} cy={fraction(i + 400) * (thumbnail ? 105 : 304)} r={1 + fraction(i) * 2} fill="#fff7d4" opacity="0.42"/>)}
    {!thumbnail && <><g fill="#474f92" stroke={ink} strokeWidth="1.8">
      {[12, 65, 118, 171].map((x, i) => <path key={x} d={`M ${x} 0 L ${x} 66 Q ${x + 24} ${70 + i % 2} ${x + 49} 66 L ${x + 49} 0 Z`}/>)}
    </g>
    <text x="119" y="52" textAnchor="middle" fill="#fff9ed" fontSize="30" fontWeight="900" fontFamily="sans-serif" letterSpacing="9">拉 面</text>
    <circle cx="35" cy="44" r="7" fill="#fff9ed"/><circle cx="198" cy="44" r="7" fill="#fff9ed"/></>}
    <path d={thumbnail ? 'M 0 103 H 240 V 140 H 0 Z' : 'M 0 299 L 240 299 L 240 420 L 0 420 Z'} fill="#e8b878"/>
    <path d={thumbnail ? 'M 0 103 H 240' : 'M 0 299 L 240 299'} stroke="#7d6244" strokeWidth="1.3"/>
    <g stroke="#c59660" strokeWidth="1" opacity="0.42" transform={thumbnail ? 'translate(0 4) scale(1 .33)' : undefined}><path d="M 0 369 L 240 369 M 44 344 L 74 344 M 136 393 L 229 393 M 8 406 L 81 406 M 171 326 L 209 326"/></g>
    <g transform={thumbnail ? 'translate(42 -89) scale(.65)' : undefined}>
    <ellipse cx="120" cy="345" rx="65" ry="6" fill="#af8255" opacity="0.4"/>
    <g stroke={ink} strokeLinejoin="round" strokeLinecap="round">
      <path d="M 100 334 L 100 342 L 140 342 L 141 334" fill="#f4eee0" strokeWidth="2"/>
      <path d="M 43 267 C 48 307 66 337 118 337 C 167 337 189 309 195 267 Z" fill="#fffaf0" strokeWidth="2.5"/>
      <path d="M 47 281 Q 120 306 191 280 L 187 297 Q 122 322 52 298 Z" fill="#f8e7de" stroke="#d66e7a" strokeWidth="1.4"/>
      {Array.from({length: 12}, (_, i) => <path key={i} d={`M ${54 + i * 11.2} ${285 + Math.sin(i / 11 * Math.PI) * 13} v 9 h 7 v -6 h -4 v 3`} fill="none" stroke="#d77c87" strokeWidth="1.6"/>)}
      <ellipse cx="119" cy="266" rx="78" ry="24" fill="#fffbee" strokeWidth="2.5"/>
      <ellipse cx="119" cy="266" rx="69" ry="18" fill="#876c35" strokeWidth="1.7"/>
      <path d="M 60 262 Q 90 245 112 264 T 174 262 M 60 270 Q 87 252 111 270 T 176 269 M 69 278 Q 98 262 127 277 T 170 276" fill="none" stroke="#e6cf79" strokeWidth="2.5"/>
      <path d="M 136 257 L 133 230 L 160 234 L 158 264 Z" fill="#394c36" strokeWidth="1.5"/>
      <path d="M 140 235 L 145 258 M 148 237 L 153 260 M 135 244 L 157 247" stroke="#788263" strokeWidth="0.7"/>
      <ellipse cx="80" cy="263" rx="18" ry="9" fill="#f2efe0" strokeWidth="1.4" transform="rotate(-11 80 263)"/>
      <ellipse cx="80" cy="263" rx="10" ry="6" fill="#e9ad3d" stroke="none"/>
      <ellipse cx="163" cy="272" rx="12" ry="7.5" fill="#f5e5da" stroke="#b96778" strokeWidth="1" transform="rotate(-8 163 272)"/>
      <path d="M 157 272 C 157 266 170 267 167 273 C 165 277 159 275 161 272 C 162 271 164 271 164 273" fill="none" stroke="#cf7690" strokeWidth="1.2"/>
      <ellipse cx="92" cy="251" rx="17" ry="8" fill="#b95961" strokeWidth="1.5"/>
      <ellipse cx="94" cy="251" rx="10" ry="5.4" fill="#e29691" stroke="none"/>
      <g fill="#83a15e" stroke="none"><ellipse cx="63" cy="257" rx="4" ry="2.5"/><ellipse cx="68" cy="251" rx="4" ry="2.4"/><ellipse cx="74" cy="254" rx="3" ry="2.3"/><ellipse cx="98" cy="277" rx="5" ry="2.3"/></g>
      <g transform={`translate(${noodleMove} 0)`}>
        {Array.from({length: 10}, (_, i) => <path key={i} d={`M ${120 + i * 0.8} ${160 + i * 0.35} C ${118 + i * 1.2} 198 ${113 + i * 1.6} 232 ${103 + i * 2.7} 267`} fill="none" stroke="#eee3b8" strokeWidth="2.4"/>)}
        {Array.from({length: 8}, (_, i) => <path key={i} d={`M ${120 + i} 168 C ${117 + i * 1.8} 205 ${118 + i * 1.3} 245 ${108 + i * 3.2} 270`} fill="none" stroke="#b3a371" strokeWidth="0.55"/>)}
      </g>
      <path d="M 122 162 L 244 73 L 248 77 L 125 165 Z M 125 169 L 250 90 L 252 94 L 128 172 Z" fill="#b89967" strokeWidth="1.4"/>
    </g>
    {[76, 157, 185].map((x, i) => <path key={x} d={`M ${x} ${221 - i * 9} q -7 -12 0 -23 q 8 -11 1 -22`} transform={`translate(0 ${Math.sin(frame / 25 + i) * 4})`} fill="none" stroke="#fff9dc" strokeWidth="3" strokeLinecap="round" opacity={0.45 + Math.sin(frame / 30 + i) * 0.15}/>)}
    </g>
  </>;
}

function Cat({frame, thumbnail = false}: {frame: number; thumbnail?: boolean}) {
  const bob = Math.sin(frame * 0.075) * 3;
  const heart = (x: number, y: number, scale: number, rotation: number) => <path d="M 0 4 C -11 -6 -16 3 -12 10 L 0 24 L 12 10 C 18 1 7 -5 0 4 Z" transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`} fill="#eaa0b2" stroke="#654f4c" strokeWidth="1.6"/>;
  return <>
    <rect width="240" height="420" fill="#c3eade"/>
    {Array.from({length: 78}, (_, i) => <circle key={i} cx={fraction(i + 74) * 240} cy={fraction(i + 599) * (thumbnail ? 140 : 420)} r={0.7 + fraction(i + 4) * 2.2} fill="#effbf1" opacity="0.48"/>)}
    <g transform={thumbnail ? 'translate(36 -85) scale(.7)' : undefined}>
    <g transform={`translate(0 ${bob})`}>
      <g stroke={ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 173 276 C 206 293 227 268 216 249 C 208 233 190 233 183 246 C 175 259 191 270 198 261" fill="#dd9655"/>
        <path d="M 57 420 L 54 333 C 55 298 77 274 119 272 C 161 270 190 296 191 332 L 193 423 Z" fill="#d89554"/>
        <ellipse cx="120" cy="351" rx="41" ry="63" fill="#fff9ef" stroke="none"/>
        <path d="M 60 207 L 64 130 L 101 167 M 143 168 L 185 132 L 189 206" fill="#d58c50"/>
        <path d="M 68 183 L 70 146 L 91 169 M 157 171 L 179 146 L 181 183" fill="#eaa996" stroke="none"/>
        <path d="M 57 220 C 57 183 82 159 117 160 C 152 159 182 181 189 218 C 198 264 162 287 123 286 C 82 286 56 265 57 220 Z" fill="#d99655"/>
        <path d="M 58 230 C 75 220 90 226 118 236 C 143 226 171 227 190 233 C 189 265 161 284 123 284 C 86 284 62 266 58 230 Z" fill="#fffcf3" stroke="none"/>
        <path d="M 60 281 Q 122 297 182 278 L 177 286 Q 125 302 65 289 Z" fill="#be564d" strokeWidth="1.6"/>
        <circle cx="121" cy="296" r="4" fill="#e8c358" strokeWidth="1.2"/>
        <path d="M 87 218 Q 93 209 100 218 M 143 218 Q 149 209 156 218" fill="none" strokeWidth="2.5"/>
        <ellipse cx="94" cy="194" rx="6" ry="4" fill="#fff6e8" stroke="none" transform="rotate(-18 94 194)"/>
        <ellipse cx="150" cy="194" rx="6" ry="4" fill="#fff6e8" stroke="none" transform="rotate(18 150 194)"/>
        <path d="M 116 235 Q 123 231 129 235 L 123 241 Z" fill={ink} strokeWidth="1"/>
        <path d="M 123 240 L 123 246 M 123 245 Q 115 251 111 244 M 123 245 Q 130 252 135 245" fill="none" strokeWidth="1.5"/>
        <path d="M 118 249 Q 123 259 128 249" fill="#e59b9e" strokeWidth="1.1"/>
        <ellipse cx="80" cy="242" rx="9" ry="5" fill="#eeb0bd" stroke="none" transform="rotate(10 80 242)"/>
        <ellipse cx="164" cy="242" rx="9" ry="5" fill="#eeb0bd" stroke="none" transform="rotate(-10 164 242)"/>
        <circle cx="202" cy="254" r="5" fill="#fffaf0" stroke="none"/>
      </g>
    </g>
    </g>
    <g transform={`translate(0 ${-Math.sin(frame / 20) * 4})`}>
      {heart(thumbnail ? 66 : 42, thumbnail ? 19 : 142, thumbnail ? 0.53 : 0.68, -19)}
      {heart(thumbnail ? 183 : 192, thumbnail ? 9 : 88, thumbnail ? 0.58 : 0.82, 15)}
      {heart(thumbnail ? 151 : 138, thumbnail ? 0 : 111, thumbnail ? 0.37 : 0.48, 12)}
    </g>
  </>;
}

function Dance({id, frame, thumbnail = false}: {id: string; frame: number; thumbnail?: boolean}) {
  const dance = Math.sin(frame / 7);
  const floorRows = [310, 322, 340, 364, 395, 438];
  return <>
    <defs>
      <linearGradient id={`${id}-dance`} x2="0" y2="1"><stop stopColor="#7464ad"/><stop offset="0.6" stopColor="#bd86bc"/><stop offset="1" stopColor="#eaa7c7"/></linearGradient>
      <radialGradient id={`${id}-glow`}><stop stopColor="#fff8ff" stopOpacity="0.32"/><stop offset="1" stopColor="#fff8ff" stopOpacity="0"/></radialGradient>
      <clipPath id={`${id}-ball-clip`}><circle cx="120" cy="65" r="25"/></clipPath>
    </defs>
    <rect width="240" height={thumbnail ? 140 : 420} fill={`url(#${id}-dance)`}/>
    <g opacity="0.34" transform={`${thumbnail ? 'translate(0 4) scale(1 .32)' : ''} rotate(${dance * 1.3} 120 65)`}>
      <path d="M 120 65 L -70 160 L -70 235 Z" fill="#e5bbef"/>
      <path d="M 120 65 L -15 336 L 38 336 Z" fill="#deb6f0"/>
      <path d="M 120 65 L 71 330 L 112 330 Z" fill="#ecd0f7"/>
      <path d="M 120 65 L 138 330 L 194 330 Z" fill="#d8b1ef"/>
      <path d="M 120 65 L 255 213 L 257 154 Z" fill="#e9c8f1"/>
    </g>
    {[{x: 35, y: 139, r: 21}, {x: 202, y: 68, r: 17}, {x: 76, y: 37, r: 16}, {x: 151, y: 187, r: 12}, {x: 35, y: 306, r: 14}].map((b, i) => <circle key={i} cx={b.x} cy={(b.y + Math.sin(frame / 30 + i) * 5) * (thumbnail ? 0.32 : 1)} r={b.r * (thumbnail ? 0.65 : 1)} fill={`url(#${id}-glow)`}/>)}
    <path d={thumbnail ? 'M 0 84 H 240 V 140 H 0 Z' : 'M 0 271 L 240 271 L 240 420 L 0 420 Z'} fill="#3c437d"/>
    <g transform={thumbnail ? 'translate(0 -24) scale(1 .4)' : undefined}>
      {floorRows.slice(0, -1).flatMap((y, row) => Array.from({length: 10}, (_, col) => {
        const nextY = floorRows[row + 1];
        const scaleA = (y - 270) / 120;
        const scaleB = (nextY - 270) / 120;
        const leftA = 120 + (col - 5) * 34 * scaleA;
        const rightA = 120 + (col - 4) * 34 * scaleA;
        const leftB = 120 + (col - 5) * 34 * scaleB;
        const rightB = 120 + (col - 4) * 34 * scaleB;
        const color = ['#6575ad', '#4e5b92', '#77a8bc', '#455085', '#a2a89a'][(row * 3 + col + (col % 3 === 0 ? 1 : 0)) % 5];
        return <path key={`${row}-${col}`} d={`M ${leftA} ${y} L ${rightA} ${y} L ${rightB} ${nextY} L ${leftB} ${nextY} Z`} fill={color} opacity={(row + col) % 2 === 0 ? 0.95 : 0.5}/>;
      }))}
    </g>
    <g transform={thumbnail ? 'translate(54 -11) scale(.55)' : undefined}>
    <path d="M 120 0 L 120 40" stroke={ink} strokeWidth="1.6"/>
    <circle cx="120" cy="65" r="25" fill="#b8a7e6" stroke={ink} strokeWidth="2.4"/>
    <g clipPath={`url(#${id}-ball-clip)`}>
      {Array.from({length: 7}, (_, row) => Array.from({length: 9}, (_, col) => <rect key={`${row}-${col}`} x={92 + col * 7 + (row % 2) * 3} y={40 + row * 7} width="7" height="7" fill={['#fffdf2', '#eae8ff', '#cec5e8', '#ada0dc', '#f0e8ff'][(col * 3 + row + Math.floor(frame / 5)) % 5]} stroke="#9385b9" strokeWidth="0.45"/>))}
      <path d="M 120 40 C 102 48 104 80 120 90 M 120 40 C 134 48 137 79 120 90" fill="none" stroke="#9889b9" strokeWidth="0.7"/>
    </g>
    <circle cx="120" cy="65" r="25" fill="none" stroke={ink} strokeWidth="2.1"/>
    </g>
    <g transform={`translate(${(thumbnail ? 76 : 45) + dance * 3} ${(thumbnail ? 58 : 238) - Math.abs(dance) * 5}) scale(${thumbnail ? 0.58 : 1}) rotate(${dance * 4} 75 62)`}>
      <svg width="150" height="122" viewBox="0 0 160 130"><Mascot frame={frame} pose="happy"/></svg>
    </g>
    {[{x: 34, y: 32, s: 4}, {x: 76, y: 59, s: 4}, {x: 157, y: 67, s: 5}, {x: 202, y: 134, s: 5}, {x: 44, y: 100, s: 6}, {x: 161, y: 201, s: 5}, {x: 26, y: 214, s: 4}, {x: 179, y: 246, s: 5}, {x: 152, y: 273, s: 6}].map((s, i) => <Sparkle key={i} x={s.x} y={s.y * (thumbnail ? 0.32 : 1)} size={s.s * (thumbnail ? 0.65 : 1)} color={i % 3 === 0 ? '#efdc83' : '#ffeff4'} opacity={0.45 + Math.sin(frame / 15 + i) ** 2 * 0.55}/>)}
  </>;
}

/** Original vector artwork, with no external images or runtime network requests. */
export function SceneArtwork({scene, frame = 0, thumbnail = false}: {scene: Scene; frame?: number; thumbnail?: boolean}) {
  const id = `scene-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return <svg viewBox={thumbnail ? '0 0 240 140' : '0 0 240 420'} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{display: 'block'}} aria-label={scene}>
    <defs>
      <filter id={`${id}-paper`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.83" numOctaves="3" seed="8" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
    </defs>
    {scene === 'city' && <City id={id} frame={frame} thumbnail={thumbnail}/>}
    {scene === 'ramen' && <Ramen id={id} frame={frame} thumbnail={thumbnail}/>}
    {scene === 'cat' && <Cat frame={frame} thumbnail={thumbnail}/>}
    {scene === 'dance' && <Dance id={id} frame={frame} thumbnail={thumbnail}/>}
    <rect width="240" height="420" fill="#d1bea0" opacity="0.047" filter={`url(#${id}-paper)`}/>
  </svg>;
}
