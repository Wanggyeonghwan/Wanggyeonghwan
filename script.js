const authButtons = document.querySelectorAll('[data-auth]');
const authMessage = document.getElementById('auth-message');
const yearEl = document.getElementById('year');

function setAuthPlaceholderMessage(type) {
  if (!authMessage) return;

  authMessage.textContent =
    type === 'signup'
      ? '회원가입 연결 준비 완료: 다음 단계에서 API 연동 예정입니다.'
      : '로그인 연결 준비 완료: 다음 단계에서 인증 모듈을 연결합니다.';
}

authButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const type = button.getAttribute('data-auth') || 'signin';
    setAuthPlaceholderMessage(type);
  });
});

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
