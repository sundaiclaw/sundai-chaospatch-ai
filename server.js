import express from 'express';
const app = express();
app.use(express.json({limit:'1mb'}));
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.CC_BASE_URL || 'https://computecommunity.com/sundai-server/v1';
const MODEL = process.env.CC_MODEL || 'MiniMaxAI/MiniMax-M2.5';

app.get('/', (_req,res)=>res.send(`<!doctype html><html><body style="font-family:system-ui;max-width:900px;margin:40px auto">
<h1>ChaosPatch AI</h1><p>Turn release notes into failure drills + rollback gameplans.</p>
<textarea id='release' rows='8' style='width:100%' placeholder='Paste release notes / changelog...'></textarea>
<button onclick='run()'>Generate Drill</button><pre id='out' style='white-space:pre-wrap;background:#f5f5f5;padding:16px'></pre>
<script>
async function run(){
 const release=document.getElementById('release').value.trim();
 const out=document.getElementById('out'); out.textContent='Running AI analysis...';
 const r=await fetch('/api/drill',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({release})});
 const d=await r.json(); out.textContent=d.result||d.error||JSON.stringify(d,null,2);
}
</script></body></html>`));

app.post('/api/drill', async (req,res)=>{
  try{
    const release=(req.body?.release||'').trim();
    if(!release) return res.status(400).json({error:'release is required'});
    const prompt = `You are an SRE incident coach. Analyze this release input and return:\n1) Top 3 failure scenarios\n2) Early warning signals\n3) 30-minute rollback + mitigation runbook\n4) Go/No-Go verdict with confidence 0-100\n\nRelease:\n${release}`;
    const rr = await fetch(`${BASE_URL}/chat/completions`,{
      method:'POST',
      headers:{'Authorization':`Bearer ${process.env.CC_API_KEY}`,'Content-Type':'application/json'},
      body: JSON.stringify({model:MODEL,messages:[{role:'user',content:prompt}],temperature:0.4})
    });
    if(!rr.ok){ const t=await rr.text(); return res.status(502).json({error:`LLM call failed: ${rr.status}`,details:t.slice(0,500)}); }
    const j = await rr.json();
    const result = j?.choices?.[0]?.message?.content || 'No output';
    res.json({result});
  }catch(e){res.status(500).json({error:String(e)});}
});
app.listen(PORT,()=>console.log(`http://localhost:${PORT}`));
