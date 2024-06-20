document.addEventListener('DOMContentLoaded', function () {

  //Ao clicar em um botão de ocupação
  async function handleOcupButtonClick(event) {
    //pegar botões de ocupação
    const ocupButtons = document.querySelectorAll('#ocupacoes button')
    //remove a classe ativa dos demais
    ocupButtons.forEach((button) => button.classList.remove('active'))
    //identifica o botão que foi criado (o elemento que gerou o evento)
    const ocupButton = event.target
    //inclui a classe active 
    ocupButton.classList.add('active')
    // acompanhar execucação no dev tools (pode remover)
    console.log(ocupButton)

    //Seleciona o elemento HTLM onde as skills irão ser exibidas
    const hardSkills = document.querySelector('#hard')
    // Limpa todas as vezes que selecionar uma nova ocupação
    hardSkills.innerHTML = ''

    //Pegando um elemento no html (querySelector)
    const barOcupadas = document.querySelector('#bar-ocupadas')
    const barNocupadas = document.querySelector('#bar-nocupadas')

    const barLabelOcupadas = document.querySelector('#ocupadas-label')
    const barLabelNocupadas = document.querySelector('#nocupadas-label')

    // Pega o ID do campi através do atributo data-campi-id
    const campiId = ocupButton.getAttribute('data-campi-id')

    // Chamada pra API (python) que retorna a quantidade de vagas ocupadas/nocupadas do banco de dados
    const data = await fetch(`http://127.0.0.1:8000/list/campi/ocup/total/${campiId}/${ocupButton.id}/`, {
      method: 'GET'
    })
      .then((res) => res.json()) // sucesso > transforma em json
      .then((data) => data) // retorna o sucesso/dados da etapa anterior
      .catch((error) => console.log(error)) // erro

    console.log(data)

    //Calculos
    const total = data.ocupadas + data.nocupadas
    const percentageOcupadas = (data.ocupadas * 100) / total
    const percentageNocupadas = 100 - percentageOcupadas

    //Prencher no html conforme o calculo
    barOcupadas.style.width = `${percentageOcupadas}%`
    barNocupadas.style.width = `${percentageNocupadas}%`

    // A label só aparece se o dado existir
    if (percentageOcupadas < 1) {
      barLabelOcupadas.style.display = 'none'
    }
    else {
      barLabelOcupadas.style.display = 'block'
    }

    if (percentageNocupadas < 1) {
      barLabelNocupadas.style.display = 'none'
    }
    else {
      barLabelNocupadas.style.display = 'block'
    }

    // Preenche no HTML o tamanho
    barLabelOcupadas.style.width = `${percentageOcupadas}%`
    barLabelNocupadas.style.width = `${percentageNocupadas}%`

    // Preenche no HTML o valor
    barOcupadas.innerHTML = data.ocupadas
    barNocupadas.innerHTML = data.nocupadas

    // Mapeando os dados recebidos (data) e transforma em lista <li>
    hardSkills.innerHTML = data.hard.map((skill) => `<li>${skill}</li>`).join('');

  }

  const campiButtons = document.querySelectorAll('#campi button')
  async function handleCampiButtonClick(event) {
    // Ocupações
    const ocupacoesContainer = document.querySelector('#ocupacoes')
    ocupacoesContainer.innerHTML = ''
    // Skills
    const hardSkills = document.querySelector('#hard')
    hardSkills.innerHTML = ''
    // Top 5
    const topOcup = document.querySelector('#top-ocup')
    topOcup.innerHTML = ''
    const topNocup = document.querySelector('#top-nocup')
    topNocup.innerHTML = ''

    // Preenche o termômetro de vagas ocupadas e não ocupadas
    const barOcupadas = document.querySelector('#bar-ocupadas')
    const barNocupadas = document.querySelector('#bar-nocupadas')

    const barLabelOcupadas = document.querySelector('#ocupadas-label')
    const barLabelNocupadas = document.querySelector('#nocupadas-label')

    let ocupButtons = document.querySelectorAll('#ocupacoes button')
    if (ocupButtons.length) {
      ocupButtons.forEach((button) => button.removeEventListener('click', handleOcupButtonClick))
    }
    campiButtons.forEach((button) => button.classList.remove('active'))

    const campi = event.target
    campi.classList.add('active')
    console.log(campi)

    const data = await fetch('http://127.0.0.1:8000/list/campi/ocup/' + campi.id, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => console.log(error))

    console.log(data)

    data.rows.forEach((vaga) => {
      const element = `
        <span class="item"><button id="${vaga}" data-campi-id="${campi.id}">${vaga}</button></span>
      `
      ocupacoesContainer.innerHTML += element

    })

    // Retorna o top 5 ocupadas e preenche na visualização
    data.topOcup.forEach((ocup) => {
      const element = `
        <div class="top-ocup-item">
          ${ocup['Ocupação']}
          <span class="top-ocup-badge">${ocup['ocup_sum']}</span>
        </div>
      `
      topOcup.innerHTML += element

    })

    // Retorna o top 5 não ocupadas e preenche na visualização
    data.topNocup.forEach((ocup) => {
      const element = `
        <div class="top-ocup-item">
          ${ocup['Ocupação']}
          <span class="top-nocup-badge">${ocup['ocup_sum']}</span>
        </div>
      `
      topNocup.innerHTML += element

    })

    const total = data.ocupadas + data.nocupadas
    const percentageOcupadas = (data.ocupadas * 100) / total
    const percentageNocupadas = 100 - percentageOcupadas

    barOcupadas.style.width = `${percentageOcupadas}%`
    barNocupadas.style.width = `${percentageNocupadas}%`

    if (percentageOcupadas < 1) {
      barLabelOcupadas.style.display = 'none'
    }
    else {
      barLabelOcupadas.style.display = 'block'
    }

    if (percentageNocupadas < 1) {
      barLabelNocupadas.style.display = 'none'
    }
    else {
      barLabelNocupadas.style.display = 'block'
    }

    barLabelOcupadas.style.width = `${percentageOcupadas}%`
    barLabelNocupadas.style.width = `${percentageNocupadas}%`

    barOcupadas.innerHTML = data.ocupadas
    barNocupadas.innerHTML = data.nocupadas

    //Seleciona todos os botão de ocupação
    ocupButtons = document.querySelectorAll('#ocupacoes button')
    //Cria o evento de click em cada botão de ocupação
    ocupButtons.forEach((button) => button.addEventListener('click', handleOcupButtonClick))
  }
  //Clique no botão de cidade/campus
  campiButtons.forEach((button) => button.addEventListener('click', handleCampiButtonClick))

})
