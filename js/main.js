// Verasail — minimal site JS
(function(){
  document.documentElement.classList.remove('no-js');
  // Mobile nav toggle
  var toggle=document.querySelector('.nav-toggle'), links=document.getElementById('nav-links');
  if(toggle&&links){
    toggle.addEventListener('click',function(){
      var open=links.classList.toggle('open');
      toggle.setAttribute('aria-expanded',open?'true':'false');
      toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&links.classList.contains('open')){links.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.focus();}
    });
  }
  // Footer year
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
  // Reveal on scroll
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.12});
    els.forEach(function(el){io.observe(el);});
  } else { els.forEach(function(el){el.classList.add('in');}); }
  // Email links: assembled at runtime so the address never appears in the HTML source (spam protection)
  function emailAddr(el){return (el.getAttribute('data-user')||'')+'\u0040'+(el.getAttribute('data-domain')||'');}
  var EMAIL=['info','verasail.com'].join('\u0040');
  document.querySelectorAll('.js-email').forEach(function(el){
    var addr=emailAddr(el); if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addr)) return;
    var a=document.createElement('a'); a.href='mai'+'lto:'+addr; a.textContent=addr; a.className='email-link';
    el.textContent=''; el.appendChild(a);
  });
  // Contact form: honeypot + arithmetic human check + minimum time, then hand off to the email app (no server required)
  var form=document.getElementById('contact-form');
  if(form){
    var loadedAt=Date.now();
    var qEl=document.getElementById('hc-question'), hc=document.getElementById('human-check'), hcErr=document.getElementById('hc-error');
    var hp=document.getElementById('website'), status=document.getElementById('form-status');
    var x=1+Math.floor(Math.random()*9), yv=1+Math.floor(Math.random()*9), answer=x+yv;
    if(qEl) qEl.textContent='What is '+x+' + '+yv+'?';
    function setErr(msg){
      if(!hc||!hcErr) return;
      hcErr.textContent=msg;
      if(msg){hc.setAttribute('aria-invalid','true');} else {hc.removeAttribute('aria-invalid');}
    }
    if(hc) hc.addEventListener('input',function(){ if(hcErr&&hcErr.textContent) setErr(''); });
    form.addEventListener('submit',function(e){
      e.preventDefault();
      // Honeypot: real visitors never see or fill this field; bots that do are silently ignored
      if(hp&&hp.value.trim()!=='') return;
      // Time check: ignore submissions made within 3 seconds of page load
      if(Date.now()-loadedAt<3000) return;
      if(!form.checkValidity()){form.reportValidity();return;}
      if(hc&&parseInt(hc.value.trim(),10)!==answer){
        setErr('That answer doesn\u2019t look right. Please try the math question again.');
        hc.focus(); return;
      }
      setErr('');
      var f=new FormData(form);
      var subject='Website inquiry from '+f.get('name')+(f.get('company')?' ('+f.get('company')+')':'');
      var body='Name: '+f.get('name')+'\nEmail: '+f.get('email')+'\nCompany: '+(f.get('company')||'')+'\nInterest: '+(f.get('interest')||'')+'\n\n'+f.get('message');
      window.location.href='mai'+'lto:'+EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      if(status) status.textContent='Opening your email app\u2026 If nothing happens, email us directly at '+EMAIL+'.';
    });
  }
})();
