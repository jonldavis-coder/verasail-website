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
  // Contact form: build a mailto: link (no server required)
  var form=document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.checkValidity()){form.reportValidity();return;}
      var f=new FormData(form);
      var subject='Website inquiry from '+f.get('name')+(f.get('company')?' ('+f.get('company')+')':'');
      var body='Name: '+f.get('name')+'\nEmail: '+f.get('email')+'\nCompany: '+(f.get('company')||'')+'\nInterest: '+(f.get('interest')||'')+'\n\n'+f.get('message');
      window.location.href='mailto:info@verasail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      var s=document.getElementById('form-status');
      if(s) s.textContent='Opening your email app… If nothing happens, email us directly at info@verasail.com.';
    });
  }
})();
