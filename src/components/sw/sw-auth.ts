/**
 * <sw-auth> — sesión JWT: chip de estado, diálogo de login y pegado de token.
 *
 * Pegar un JWT a mano está al mismo nivel que iniciar sesión, no escondido:
 * en desarrollo se prueba a menudo con un token que ya se tiene, y forzar el
 * login contra el orquestador para eso es fricción sin ninguna ganancia.
 *
 * Props: { authEnabled, auth, session }
 * Evento: sw-session-change  detail: { session }
 */

import { adoptCss, precargarCss, define, html, emitir, avisar } from './_shared.js';
import {
  clearJwt,
  fetchTestJwt,
  getStoredJwt,
  normalizeJwt,
  readCredentials,
  saveCredentials,
  sessionLabel,
  storeJwt,
} from '../../js/auth.js';

type Props = { authEnabled: boolean; auth: SwAuthConfig; session: SwSesion | null; };

class SwAuth extends HTMLElement {
  #root: ShadowRoot;
  #props: Props = { authEnabled: false, auth: {}, session: null };
  #dialogo: HTMLElement | null = null;
  #ocupado = false;
  #error = '';

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.#render();
  }

  get props(): Props {
    return this.#props;
  }

  set props(v: Partial<Props> | null | undefined) {
    this.#props = { ...this.#props, ...(v ?? {}) };
    if (this.isConnected) this.#render();
  }

  /** Punto de entrada público: `sw-app` lo llama cuando una operación pide JWT. */
  abrirLogin(hint?: string): void {
    if (hint) this.#error = hint;
    this.#render();
    (this.#dialogo as (HTMLElement & { show(): void }) | null)?.show();
  }

  #anunciarSesion(): void {
    emitir(this, 'sw-session-change', { session: getStoredJwt() });
  }

  async #entrar(usuario: string, clave: string, recordar: boolean): Promise<void> {
    const { auth } = this.#props;
    this.#ocupado = true;
    this.#error = '';
    this.#render();
    (this.#dialogo as (HTMLElement & { show(): void }) | null)?.show();

    try {
      const data = await fetchTestJwt(auth.loginUrl, usuario, clave, {
        loginPath: auth.loginPath,
        loginKind: auth.loginKind,
        appId: auth.app,
        provider: auth.provider,
      });
      storeJwt(data.token, { username: usuario, nombre: data.nombre, expiresAt: data.expiresAt });
      saveCredentials(usuario, clave, recordar);
      this.#ocupado = false;
      this.#anunciarSesion();
      avisar('Sesión iniciada.', 'success');
      // El render lo dispara `sw-app` al propagar la sesión nueva.
      (this.#dialogo as (HTMLElement & { hide(): void }) | null)?.hide();
    } catch (e) {
      this.#ocupado = false;
      this.#error = (e as Error)?.message ?? String(e);
      this.#render();
      (this.#dialogo as (HTMLElement & { show(): void }) | null)?.show();
    }
  }

  #pegarToken(valor: string): void {
    const token = normalizeJwt(valor);
    if (!token) {
      this.#error = 'Pega un JWT válido (con o sin el prefijo «Bearer»).';
      this.#render();
      (this.#dialogo as (HTMLElement & { show(): void }) | null)?.show();
      return;
    }
    storeJwt(token, { username: 'JWT pegado' });
    this.#anunciarSesion();
    avisar('Token guardado para esta pestaña.', 'success');
    (this.#dialogo as (HTMLElement & { hide(): void }) | null)?.hide();
  }

  #salir(): void {
    clearJwt();
    this.#anunciarSesion();
    avisar('Sesión cerrada.');
  }

  #render(): void {
    const { authEnabled, session } = this.#props;
    this.#root.replaceChildren();
    this.#dialogo = null;

    if (!authEnabled) {
      adoptCss(this.#root, import.meta.url, 'sw-auth');
      return;
    }

    const guardadas = readCredentials();
    const activa = !!session?.token;

    this.#root.append(html`
      <div class="auth">
        ${activa
          ? html`
              <is-dropdown class="menu">
                <is-button slot="trigger" variant="outlined" color="success" with-caret>
                  <is-icon slot="start" icon="mdi:account-check-outline"></is-icon>
                  ${sessionLabel(session)}
                </is-button>
                <is-dropdown-item onclick=${() => this.abrirLogin()}>Cambiar sesión</is-dropdown-item>
                <is-dropdown-item color="danger" onclick=${() => this.#salir()}>Cerrar sesión</is-dropdown-item>
              </is-dropdown>
            `
          : html`
              <is-button variant="outlined" color="neutral" onis-click=${() => this.abrirLogin()}>
                <is-icon slot="start" icon="mdi:login-variant"></is-icon>
                Iniciar sesión
              </is-button>
            `}

        <is-dialog class="dialogo" label="Sesión para probar endpoints">
          ${this.#error
            ? html`
                <is-callout color="danger" variant="filled-outlined" icon="mdi:alert-outline">
                  <pre class="error">${this.#error}</pre>
                </is-callout>
              `
            : null}

          <form
            class="formulario"
            onsubmit=${(e: Event) => {
              e.preventDefault();
              const raiz = this.#root;
              const usuario = (raiz.querySelector('#usuario') as HTMLInputElement | null)?.value ?? '';
              const clave = (raiz.querySelector('#clave') as HTMLInputElement | null)?.value ?? '';
              const recordar = (raiz.querySelector('#recordar') as HTMLInputElement | null)?.checked ?? false;
              void this.#entrar(usuario, clave, recordar);
            }}
          >
            <is-input
              id="usuario"
              full-width
              label="Usuario o correo"
              autocomplete="username"
              value="${guardadas.username}"
              ${this.#ocupado ? 'disabled' : ''}
            ></is-input>
            <is-input
              id="clave"
              type="password"
              full-width
              password-toggle
              label="Contraseña"
              autocomplete="current-password"
              value="${guardadas.password}"
              ${this.#ocupado ? 'disabled' : ''}
            ></is-input>
            <is-checkbox id="recordar" ${guardadas.remember ? 'checked' : ''}>
              Recordar en este equipo
            </is-checkbox>
            <p class="nota">
              El token vive solo en esta pestaña. «Recordar» guarda las credenciales
              ofuscadas en este navegador; no lo actives en un equipo compartido.
            </p>
            <is-button type="submit" color="brand" ${this.#ocupado ? 'loading' : ''}>Entrar</is-button>
          </form>

          <is-divider></is-divider>

          <div class="pegar">
            <is-input
              id="token"
              full-width
              label="…o pega un JWT"
              placeholder="eyJhbGciOi…"
              spellcheck="false"
            ></is-input>
            <is-button
              variant="outlined"
              color="neutral"
              onis-click=${() =>
                this.#pegarToken((this.#root.querySelector('#token') as HTMLInputElement | null)?.value ?? '')}
            >
              Usar token
            </is-button>
          </div>
        </is-dialog>
      </div>
    `);

    this.#dialogo = this.#root.querySelector('.dialogo');
    // `is-button type=submit` vive en Shadow DOM: el submit nativo no cruza,
    // hay que pedirlo explícitamente (error conocido del kit).
    const enviar = this.#root.querySelector('is-button[type="submit"]');
    const form = this.#root.querySelector('form');
    enviar?.addEventListener('is-click', () => form?.requestSubmit());

    adoptCss(this.#root, import.meta.url, 'sw-auth');
  }
}

precargarCss(import.meta.url, 'sw-auth');
define('sw-auth', SwAuth);
export { SwAuth };
