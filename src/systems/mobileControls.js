export function criarControlesMobile(scene) {

    const touchInput = {
        left: false,
        right: false,
        up: false,
        down: false,
        run: false,
        interact: false
    };

    //detectar mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) {
        return touchInput; // Retorna o objeto vazio para não usar controles móveis
    }

    const container = document.createElement('div');
    container.id = "mobileControls";

    document.body.appendChild(container);

    const dpad = document.createElement('div');
    dpad.style.position = 'fixed';
    dpad.style.top = '20px';
    dpad.style.left = '20px';
    //dpad.style.bottom = '20px';
    dpad.style.zIndex = '9999';

    container.appendChild(dpad);

    const actions = document.createElement('div');
    actions.style.position = 'fixed';
    actions.style.top = '50%';
    actions.style.right = '20px';
    actions.style.transform = 'translateY(-50%)'; //centraliza verticalmente
    //actions.style.bottom = '20px';
    actions.style.zIndex = '9999';

    container.appendChild(actions);

    function criarBotao(parent, label, x, y, onPress, onRelease) {
        const size = Math.min(window.innerWidth, window.innerHeight) * 0.15; // Tamanho do botão baseado na menor dimensão da tela

        const btn = document.createElement('div');
        btn.innerText = label;
        btn.style.position = 'absolute';
        btn.style.left = x + 'px';
        btn.style.top = y + 'px';

        btn.style.width = size + 'px';
        btn.style.height = size + 'px';
        btn.style.backgroundColor = 'rgba(78, 78, 78, 0.6)';
        btn.style.color = '#fff';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.borderRadius = '12px';
        btn.style.fontSize = '20px';
        btn.style.userSelect = 'none';

        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            onPress();
        });
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            onRelease();
        });

        parent.appendChild(btn);

    }

    // D-PAD
    criarBotao(dpad, "↑", 48, 350, () => touchInput.up = true, () => touchInput.up = false);
    criarBotao(dpad, "↓", 48, 470, () => touchInput.down = true, () => touchInput.down = false);
    criarBotao(dpad, "←", -10, 410, () => touchInput.left = true, () => touchInput.left = false);
    criarBotao(dpad, "→", 106, 410, () => touchInput.right = true, () => touchInput.right = false);

    // botões direita
    criarBotao(dpad, "RUN", 290, 480, () => touchInput.run = true, () => touchInput.run = false);
    criarBotao(dpad, "E", 290, 345, () => touchInput.interact = true, () => touchInput.interact = false);

    return touchInput;
}