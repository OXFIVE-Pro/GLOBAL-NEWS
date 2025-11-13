import React from 'react'
import TVPlayer from './components/TVPlayer'
import Dashboard from './components/Dashboard'
import AdManager from './components/AdManager'
export default function App(){return (<div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:12,height:'100vh',padding:12}}><div style={{display:'flex',flexDirection:'column',gap:12}}><div style={{flex:1,minHeight:300}}><TVPlayer src='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' watermark={{url:'/logo.png', width:140}}/></div><div style={{height:320}}><Dashboard/></div></div><div style={{display:'flex',flexDirection:'column',gap:12}}><AdManager/></div></div>)}
