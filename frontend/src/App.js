function App() {
  console.log(document.cookie)

  function klik() {
    const cfg = {
      method: "POST",
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ username: "Bork" }),
    }
    fetch("http://localhost:6999/login", cfg)
      .then(response => response.text())
      .then(console.log)
      .catch(console.error)
  }
  return <button onClick={klik}>Klik</button>
}

export default App
