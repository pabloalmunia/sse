export default function (message, buttons = ['ok']) {
  const el = document.createElement('todo-dialog');
  el.render(message, buttons)
  document.body.appendChild(el);
  return new Promise(resolve => {
    el.addEventListener('finish', (evt) => {
      document.body.removeChild(el);
      resolve(evt.detail);
    })
  });
};

class Dialog extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({mode: 'open'});
  }

  render (message, buttons) {
    const root     = this.shadowRoot;
    // language=HTML
    root.innerHTML = `
      <link rel="stylesheet" href="https://cdn.graphery.online/stylent/stylent.min.css">
      <style>
        .dialog-background {
          position         : absolute;
          top              : 0;
          left             : 0;
          right            : 0;
          bottom           : 0;
          background-color : rgba(128, 128, 128, 0.5);
          z-index          : 1000;
        }

        .dialog {
          z-index    : 1100;
          background : var(--st-color-0);
          position   : absolute;
          top        : 40%;
          right      : 35%;
          left       : 35%;
          bottom     : 40%;
          min-width  : 20em;
          min-height : 5em;
          box-shadow : 0 0 5px 1px rgb(0 0 0 / 50%);
          padding    : 1em;
        }

        .dialog button {
          width     : 20%;
          min-width : 8em;
          height    : 2em;
          margin    : 0.3em;
          padding   : 0;
        }

        .message {
          height          : 70%;
          display         : flex;
          align-items     : center;
          justify-content : center;
        }

        .buttons {
          display         : flex;
          justify-content : center;
        }
      </style>
      <div class="dialog-background"></div>
      <div class="dialog">
        <div class="message">
          ${message}
        </div>
        <div class="buttons">
          ${buttons.map((button, idx) => `<button id="btn_${idx}">${button}</button> `).join('\n')}
        </div>
      </div>
    `
    buttons.map((_button, idx) => root.querySelector(`#btn_${idx}`).addEventListener('click', (evt) => {
      const buttonIdx = Number(evt.target.id.substring(4));
      this.dispatchEvent(new CustomEvent('finish', {detail: buttonIdx}));
    }))
  }
}

if (!customElements.get('todo-dialog')) {
  customElements.define('todo-dialog', Dialog);
}