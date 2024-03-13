document.addEventListener('DOMContentLoaded', function() {
    async function listOcup() {
        const data = await fetch('http://127.0.0.1:8000/ocupacoes', {
          method: 'GET',
        })
          .then((res) => res.json())
          .then((data) => data)
          .catch((error) => console.log(error))
      
        //document.querySelector('#cargos').innerHTML = ''
        console.log(data)
    }

    listOcup()
})
