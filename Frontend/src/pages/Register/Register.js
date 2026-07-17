(function(){
  const tabs = document.getElementById('tabs');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const ticketTitle = document.getElementById('ticketTitle');
  const ticketSub = document.getElementById('ticketSub');
  const orderNo = document.getElementById('orderNo');

  function randomOrder(){
    return '#' + String(Math.floor(Math.random()*90000)+10000);
  }

  function showLogin(){
    tabs.classList.remove('reg');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    ticketTitle.textContent = 'Welcome back';
    ticketSub.textContent = 'Sign in to reorder your usual';
    orderNo.textContent = randomOrder();
  }

  function showRegister(){
    tabs.classList.add('reg');
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    ticketTitle.textContent = 'Pull up a chair';
    ticketSub.textContent = 'Create your account to start ordering';
    orderNo.textContent = randomOrder();
  }

  tabLogin.addEventListener('click', showLogin);
  tabRegister.addEventListener('click', showRegister);
  document.getElementById('goRegister').addEventListener('click', showRegister);
  document.getElementById('goLogin').addEventListener('click', showLogin);

  // password show/hide
  document.querySelectorAll('.pw-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const input = document.getElementById(btn.dataset.target);
      const isPw = input.type === 'password';
      input.type = isPw ? 'text' : 'password';
      btn.textContent = isPw ? 'HIDE' : 'SHOW';
    });
  });

  // password strength meter
  const regPass = document.getElementById('regPass');
  const strengthBar = document.getElementById('strengthBar');
  regPass.addEventListener('input', ()=>{
    const v = regPass.value;
    let score = 0;
    if(v.length >= 8) score++;
    if(/[A-Z]/.test(v)) score++;
    if(/[0-9]/.test(v)) score++;
    if(/[^A-Za-z0-9]/.test(v)) score++;
    const pct = (score/4)*100;
    strengthBar.style.width = pct + '%';
    const colors = ['#ff6b6b','#ff6b6b','#f4a93b','#c9e265','#7fd858'];
    strengthBar.style.background = colors[score];
  });

  function setError(fieldId, show){
    const field = document.getElementById(fieldId);
    field.classList.toggle('show-err', show);
  }

  function validEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function toast(msg){
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    t.classList.add('show');
    setTimeout(()=> t.classList.remove('show'), 2600);
  }

  function fakeSubmit(btn, onDone){
    btn.classList.add('loading');
    btn.disabled = true;
    setTimeout(()=>{
      btn.classList.remove('loading');
      btn.disabled = false;
      onDone();
    }, 1100);
  }

  // LOGIN validation + submit
  loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('loginEmail');
    const pass = document.getElementById('loginPass');
    let ok = true;

    if(!validEmail(email.value)){ setError('loginEmailField', true); ok = false; }
    else setError('loginEmailField', false);

    if(pass.value.length === 0){ setError('loginPassField', true); ok = false; }
    else setError('loginPassField', false);

    if(!ok) return;

    fakeSubmit(document.getElementById('loginSubmit'), ()=>{
      toast('Signed in — order history restored');
    });
  });

  // REGISTER validation + submit
  registerForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('regName');
    const email = document.getElementById('regEmail');
    const pass = document.getElementById('regPass');
    const confirm = document.getElementById('regConfirm');
    let ok = true;

    if(name.value.trim().length === 0){ setError('regNameField', true); ok = false; }
    else setError('regNameField', false);

    if(!validEmail(email.value)){ setError('regEmailField', true); ok = false; }
    else setError('regEmailField', false);

    if(pass.value.length < 8){ setError('regPassField', true); ok = false; }
    else setError('regPassField', false);

    if(confirm.value !== pass.value || confirm.value.length === 0){ setError('regConfirmField', true); ok = false; }
    else setError('regConfirmField', false);

    if(!ok) return;

    fakeSubmit(document.getElementById('registerSubmit'), ()=>{
      toast('Account created — welcome to FoodHub');
      setTimeout(showLogin, 1400);
    });
  });

  // clear error state as user types
  document.querySelectorAll('.field input').forEach(inp=>{
    inp.addEventListener('input', ()=>{
      inp.closest('.field').classList.remove('show-err');
    });
  });

  orderNo.textContent = randomOrder();
})();