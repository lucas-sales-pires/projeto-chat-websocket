const login = document.querySelector(".login")
const loginForm = login.querySelector(".login_form")
const loginInput = login.querySelector(".login_input")

const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat_form")
const chatInput = chat.querySelector(".chat_input")
const mensagensChat = chat.querySelector(".chat_mensagens")

const cores = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const usuario = { id: "", nome: "", cor: "" }

let websocket

const criarElementoMensagemPropria = (conteudo) => {
    const div = document.createElement("div")

    div.classList.add("sua_mensagem")
    div.innerHTML = conteudo

    return div
}

const criarElementoMensagemOutro = (conteudo, remetente, corRemetente) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("mensagem_outro")

    span.classList.add("mensagem-enviada")
    span.style.color = corRemetente

    div.appendChild(span)

    span.innerHTML = remetente
    div.innerHTML += conteudo

    return div
}

const obterCorAleatoria = () => {
    const indiceAleatorio = Math.floor(Math.random() * cores.length)
    return cores[indiceAleatorio]
}

const rolarTela = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processarMensagem = ({ data }) => {
    const { idUsuario, nomeUsuario, corUsuario, conteudo } = JSON.parse(data)

    const mensagem =
        idUsuario == usuario.id
            ? criarElementoMensagemPropria(conteudo)
            : criarElementoMensagemOutro(conteudo, nomeUsuario, corUsuario)

    mensagensChat.appendChild(mensagem)

    rolarTela()
}

const lidarComLogin = (evento) => {
    evento.preventDefault()

    usuario.id = crypto.randomUUID()
    usuario.nome = loginInput.value
    usuario.cor = obterCorAleatoria()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("wss://projeto-chat-websocket.onrender.com")
    websocket.onmessage = processarMensagem
}

const enviarMensagem = (evento) => {
    evento.preventDefault()

    const mensagem = {
        idUsuario: usuario.id,
        nomeUsuario: usuario.nome,
        corUsuario: usuario.cor,
        conteudo: chatInput.value
    }

    websocket.send(JSON.stringify(mensagem))

    chatInput.value = ""
}

loginForm.addEventListener("submit", lidarComLogin)
chatForm.addEventListener("submit", enviarMensagem)
