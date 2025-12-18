// ----------------- UTILIDADES / CONFIG -----------------
const owner = {
  name: "Esteban Canchari Quintana",
  phone: "+51 997 714 990",
  email: "70818402@iestpasm.edu.pe",
  linkedin: "https://www.linkedin.com/in/esteban-canchari-919b56318/"
};

// small helpers
const $ = q => document.querySelector(q);
const $$ = q => Array.from(document.querySelectorAll(q));



// ABOUT card flip/open
const aboutCard = document.getElementById('aboutCard');
if (aboutCard) {
  aboutCard.addEventListener('click', () => aboutCard.classList.toggle('open'));
}

// progress bars animate when visible
function animateSkillBars(){
  $$('.bar-fill').forEach(el=>{
    const pct = el.dataset.percent || 0;
    // staggered animation
    setTimeout(()=> el.style.width = pct + '%', 150);
  });
}
window.addEventListener('load', animateSkillBars);
window.addEventListener('scroll', () => {
  // could animate on intersection; simple approach runs on load
});

// PROJECT: print CV
document.getElementById("printCV").addEventListener("click", () => {
    window.print();
});


// vCard download
document.getElementById("downloadVCard").addEventListener("click", () => {
    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:Esteban Canchari Quintana
TEL:+51997714990
EMAIL:70818402@iestpasm.edu.pe
URL:https://www.linkedin.com/in/esteban-canchari-919b56318/
END:VCARD
    `.trim();

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "Esteban_Canchari.vcf";
    a.click();

    URL.revokeObjectURL(url);
});


// CONTACT FORM behavior
const form = $('#contactForm');
const status = $('#formStatus');
const inputFields = $$('.field input, .field textarea');

function setStatus(msg, ok=true){
  status.textContent = msg;
  status.style.color = ok ? '#9cffb2' : '#ffb2b2';
}

// animate underline while typing
inputFields.forEach(el=>{
  el.addEventListener('input', () => {
    el.classList.toggle('typing', el.value.length > 0);
  });
});

// save/clear local
$('#saveLocal').addEventListener('click', ()=>{
  const data = {
    name: $('#cf_name').value,
    email: $('#cf_email').value,
    message: $('#cf_message').value
  };
  localStorage.setItem('contactDraft', JSON.stringify(data));
  setStatus('Borrador guardado localmente ✅', true);
});
$('#clearLocal').addEventListener('click', ()=>{
  localStorage.removeItem('contactDraft');
  $('#cf_name').value=''; $('#cf_email').value=''; $('#cf_message').value='';
  setStatus('Borrador eliminado', true);
});
window.addEventListener('load', ()=>{
  const d = localStorage.getItem('contactDraft');
  if(d){
    try{
      const obj = JSON.parse(d);
      $('#cf_name').value = obj.name || '';
      $('#cf_email').value = obj.email || '';
      $('#cf_message').value = obj.message || '';
    }catch(e){}
  }
});

// copy email
$('#copyEmail').addEventListener('click', async ()=>{
  try{
    await navigator.clipboard.writeText(owner.email);
    setStatus('Email copiado al portapapeles ✅', true);
  }catch(e){ setStatus('Error al copiar', false) }
});

// print page
$('#printPage').addEventListener('click', ()=> window.print());

// FORM submit -> open Gmail compose with prefilled fields
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = $('#cf_name').value.trim();
  const email = $('#cf_email').value.trim();
  const message = $('#cf_message').value.trim();

  if(!name || !email || !message){
    setStatus('Por favor completa todos los campos', false);
    return;
  }

  // create subject and body
  const subject = `Contacto desde portafolio: ${encodeURIComponent(name)}`;
  const body = encodeURIComponent(`Nombre: ${name}\nEmail remitente: ${email}\n\nMensaje:\n${message}`);

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${owner.email}&su=${subject}&body=${body}`;
  window.open(gmailUrl, '_blank');
  setStatus('Se ha abierto Gmail con tu mensaje listo para enviar ✅', true);
});

// animate inputs with small neon glow on focus
$$('.field input, .field textarea').forEach(el=>{
  el.addEventListener('focus', ()=> el.parentElement.classList.add('focused'));
  el.addEventListener('blur', ()=> el.parentElement.classList.remove('focused'));
});

// small accessibility: allow keyboard Enter to submit in message field
$('#cf_message').addEventListener('keydown', (e)=> {
  if(e.ctrlKey && e.key === 'Enter') form.dispatchEvent(new Event('submit', {cancelable:true}));
});


