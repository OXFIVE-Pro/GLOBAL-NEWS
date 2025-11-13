import React, { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
function ParticipantWindow({ id, stream, muted, videoDisabled, onToggleAudio, onToggleVideo }) {
  const videoRef = useRef(null)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (stream) {
      try { v.srcObject = stream } catch(e) { v.src = URL.createObjectURL(stream) }
      v.play().catch(()=>{})
    }
  }, [stream])
  return (
    <div style={{width:'100%', height:'100%', position:'relative', background:'#111'}}>
      <video ref={videoRef} muted={muted} playsInline autoPlay style={{width:'100%', height:'100%', objectFit:'cover'}} />
      <div style={{position:'absolute', right:6, top:6, display:'flex', gap:6}}>
        <button onClick={()=>onToggleAudio(id)} title="Toggle audio" style={{padding:'6px 8px'}}>🔈</button>
        <button onClick={()=>onToggleVideo(id)} title="Toggle video" style={{padding:'6px 8px'}}>📷</button>
      </div>
    </div>
  )
}
export default function TVPlayer({ src, watermark }) {
  const videoRef = useRef(null)
  const [participants, setParticipants] = useState(() => {
    return [
      { id: 'p1', label:'Guest 1', stream: null, audioMuted: false, videoDisabled: false },
      { id: 'p2', label:'Guest 2', stream: null, audioMuted: false, videoDisabled: false },
      { id: 'p3', label:'Guest 3', stream: null, audioMuted: false, videoDisabled: false },
      { id: 'p4', label:'Guest 4', stream: null, audioMuted: false, videoDisabled: false },
      { id: 'p5', label:'Assess.', stream: null, audioMuted: false, videoDisabled: false },
      { id: 'host', label:'Moderator', stream: null, audioMuted: false, videoDisabled: false }
    ]
  })
  useEffect(() => {
    const video = videoRef.current
    if (Hls.isSupported() && src && src.endsWith('.m3u8')) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => hls.destroy()
    } else if (video) {
      video.src = src
    }
  }, [src])
  function toggleAudioFor(ids) {
    setParticipants(prev => prev.map(p => ids.includes(p.id) ? {...p, audioMuted: !p.audioMuted} : p))
  }
  function toggleVideoFor(ids) {
    setParticipants(prev => prev.map(p => ids.includes(p.id) ? {...p, videoDisabled: !p.videoDisabled} : p))
  }
  const [selected, setSelected] = useState([])
  const layout = [
    { i: 'host', x: 0, y: 0, w: 6, h: 6 },
    { i: 'p1', x: 6, y: 0, w: 6, h: 3 },
    { i: 'p2', x: 6, y: 3, w: 6, h: 3 },
    { i: 'p3', x: 0, y: 6, w: 4, h: 3 },
    { i: 'p4', x: 4, y: 6, w: 4, h: 3 },
    { i: 'p5', x: 8, y: 6, w: 4, h: 3 }
  ]
  function onToggleSelect(id) {
    setSelected(s => s.includes(id) ? s.filter(x => x!==id) : [...s, id])
  }
  return (
    <div style={{position:'relative', width:'100%', height:'100%'}}>
      <div style={{position:'absolute', inset:0, zIndex:1}}>
        <video ref={videoRef} controls playsInline style={{width:'100%', height:'100%', objectFit:'cover'}} />
      </div>
      {watermark?.url && (
        <div style={{position:'absolute', left:12, top:12, zIndex:3, opacity:0.9, pointerEvents:'none'}}>
          <img src={watermark.url} alt="logo" style={{width: watermark.width || 120}} />
        </div>
      )}
      <div style={{position:'absolute', right:12, top:12, zIndex:4, display:'flex', gap:8, flexDirection:'column'}}>
        <div style={{background:'rgba(0,0,0,0.6)', padding:8, borderRadius:8}}>
          <div style={{marginBottom:6}}>Selecionar janelas:</div>
          {participants.map(p => (
            <label key={p.id} style={{display:'flex', alignItems:'center', gap:8}}>
              <input type="checkbox" checked={selected.includes(p.id)} onChange={()=>onToggleSelect(p.id)} />
              <span style={{fontSize:13}}>{p.label}</span>
          </label>
          ))}
          <div style={{marginTop:8, display:'flex', gap:8}}>
            <button onClick={()=>toggleAudioFor(selected)} style={{padding:'6px 10px'}}>Alternar Áudio</button>
            <button onClick={()=>toggleVideoFor(selected)} style={{padding:'6px 10px'}}>Alternar Vídeo</button>
            <button onClick={()=>setSelected([])} style={{padding:'6px 10px'}}>Limpar</button>
          </div>
        </div>
      </div>
      <div style={{position:'absolute', inset:0, zIndex:2, pointerEvents:'auto'}}>
        <GridLayout className="layout" layout={layout} cols={12} rowHeight={40} width={1200} isDraggable={true} isResizable={true}>
          {participants.map(p => (
            <div key={p.id} style={{background:'rgba(10,10,10,0.6)', border:'1px solid #222', borderRadius:6, overflow:'hidden'}}>
              <ParticipantWindow
                id={p.id}
                stream={p.stream}
                muted={p.audioMuted}
                videoDisabled={p.videoDisabled}
                onToggleAudio={(id)=>toggleAudioFor([id])}
                onToggleVideo={(id)=>toggleVideoFor([id])}
              />
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  )
}