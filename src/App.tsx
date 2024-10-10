import {Component, createSignal, For, Show} from 'solid-js'
import {io as socketio} from "socket.io-client";


const App: Component = () => {

    const [confirmed, setConfirmed] = createSignal(false)
    const [url, setUrl] = createSignal("http://localhost:3000")


    return (

        <Show
            when={!confirmed()}
            fallback={<Chat url={url()}/>}
        >
            scream at tam for url
            <input value={url()} onchange={e => setUrl(e.target.value)}/>
            <button onclick={() => setConfirmed(true)}>connect</button>
        </Show>


    );
};

export default App;


const Chat: Component<{ url: string }> = (props) => {

    const [connected, setConnected] = createSignal(false)
    const [messages, setMessages] = createSignal<string[]>([])



    const io = socketio(props.url)


    io.on('connection', (socket) => {
        setConnected(true);
        socket.on('disconnect', () => setConnected(false));
    });


    io.on("add-player",()=> {

        setMessages(prev => [...prev, "someone joined"])
    })

    return <>
        {connected() ? "connected" : "trynna connect"} to {props.url}
        <For each={messages()}>
            {(message) => <><br/>{message} </>}
        </For>
    </>
}