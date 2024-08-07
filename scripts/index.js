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

    //Seleciona o elemento HTLM onde os conhecimento serão exibidos
    const conhecimentosSkills = document.querySelector('#conhecimentos')
    // Limpa todas as vezes que selecionar uma nova ocupação
    conhecimentosSkills.innerHTML = ''

    //Seleciona o elemento HTLM onde as habilidades serão exibidas
    const habilidadesSkills = document.querySelector('#habilidades')
    // Limpa todas as vezes que selecionar uma nova ocupação
    habilidadesSkills.innerHTML = ''

    //Seleciona o elemento HTLM onde as atitudes serão exibidas
    const atitudesSkills = document.querySelector('#atitudes')
    // Limpa todas as vezes que selecionar uma nova ocupação
    atitudesSkills.innerHTML = ''

    //Pegando um elemento no html (querySelector)
    const barOcupadas = document.querySelector('#bar-ocupadas')
    const barNocupadas = document.querySelector('#bar-nocupadas')

    const barLabelOcupadas = document.querySelector('#ocupadas-label')
    const barLabelNocupadas = document.querySelector('#nocupadas-label')

    // Pega o ID do campi através do atributo data-campi-id
    const campiId = ocupButton.getAttribute('data-campi-id')

    // Loading bar
    const loadingBar = document.querySelector('#loading-bar')

    // Chamada pra API (python) que retorna a quantidade de vagas ocupadas/nocupadas do banco de dados
    loadingBar.classList.add('loading')
    const data = await fetch(`https://live-ann-marie-platform-e36f4797.koyeb.app/list/campi/ocup/total/${campiId}/${ocupButton.id}/`, {
      method: 'GET'
    })
      .then((res) => res.json()) // sucesso > transforma em json
      .then((data) => {
        loadingBar.classList.remove('loading')
        return data
      }) // retorna o sucesso/dados da etapa anterior
      .catch((error) => {
        loadingBar.classList.remove('loading')
        console.log(error)
      }) // erro

    console.log(data)

    //Calculos
    const sumNocupadas = data.ofertadas - data.ocupadas
    const total = data.ocupadas + sumNocupadas
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
    barNocupadas.innerHTML = sumNocupadas

    // Mapeando os dados recebidos (data) e transforma em lista <li>
    if (data.conhecimentos && data.conhecimentos.length > 0) {
      conhecimentosSkills.innerHTML = data.conhecimentos.map((conhecimento) => `<li>${conhecimento}</li>`).join('');
    } else {
      conhecimentosSkills.innerHTML = '<p>Nenhum conhecimento relacionado.</p>';
    }
    
    // Mapeando os dados recebidos (data) e transforma em lista <li>
    if (data.habilidades && data.habilidades.length > 0) {
      habilidadesSkills.innerHTML = data.habilidades.map((habilidade) => `<li>${habilidade}</li>`).join('');
    } else {
      habilidadesSkills.innerHTML = '<p>Nenhuma habilidade relacionada.</p>';
    }

    // Mapeando os dados recebidos (data) e transforma em lista <li>
    
    if (data.atitudes && data.atitudes.length > 0) {
      atitudesSkills.innerHTML = data.atitudes.map((atitude) => `<li>${atitude}</li>`).join('');
    } else {
      atitudesSkills.innerHTML = '<p>Nenhuma atitude relacionada.</p>';
    }

  }

  const campiButtons = document.querySelectorAll('#campi button')
  async function handleCampiButtonClick(event) {
    // Ocupações
    const ocupacoesContainer = document.querySelector('#ocupacoes')
    ocupacoesContainer.innerHTML = ''
    // Skills
    const conhecimentosSkills = document.querySelector('#conhecimentos')
    conhecimentosSkills.innerHTML = ''
    const habilidadesSkills = document.querySelector('#habilidades')
    habilidadesSkills.innerHTML = ''
    const atitudesSkills = document.querySelector('#atitudes')
    atitudesSkills.innerHTML = ''
    // Top 5
    const topOcupadas = document.querySelector('#top-ocup')
    topOcupadas.innerHTML = ''
    const topOfertadas = document.querySelector('#top-ofert')
    topOfertadas.innerHTML = ''
    const topNocupadas = document.querySelector('#top-nocup')
    topNocupadas.innerHTML = ''

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

    // Loading bar
    const loadingBar = document.querySelector('#loading-bar')

    loadingBar.classList.add('loading')
    const data = await fetch('https://live-ann-marie-platform-e36f4797.koyeb.app/list/campi/ocup/' + campi.id, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => {
        loadingBar.classList.remove('loading')
        return data
      }) // retorna o sucesso/dados da etapa anterior
      .catch((error) => {
        loadingBar.classList.remove('loading')
        console.log(error)
      }) 

    console.log(data)

    data.rows.forEach((vaga) => {
      const element = `
        <span class="item"><button id="${vaga}" data-campi-id="${campi.id}">${vaga}</button></span>
      `
      ocupacoesContainer.innerHTML += element

    })

    // Retorna o top 5 ofertadas e preenche na visualização
    data.topOfert.forEach((ocup) => {
      const element = `
        <div class="top-ocup-item">
          ${ocup['Ocupacao']}
          <span class="top-ofert-badge">${ocup['ofert_sum']}</span>
        </div>
      `
      topOfertadas.innerHTML += element

    })

    // Retorna o top 5 ocupadas e preenche na visualização
    data.topOcup.forEach((ocup) => {
      const element = `
        <div class="top-ocup-item">
          ${ocup['Ocupacao']}
          <span class="top-ocup-badge">${ocup['ocup_sum']}</span>
        </div>
      `
      topOcupadas.innerHTML += element

    })

    // Retorna o top 5 não ocupadas e preenche na visualização
    data.topNocup.forEach((ocup) => {
      const element = `
        <div class="top-ocup-item">
          ${ocup['Ocupacao']}
          <span class="top-nocup-badge">${ocup['nocup_sum']}</span>
        </div>
      `
      topNocupadas.innerHTML += element

    })

    const sumNocupadas = data.ofertadas - data.ocupadas
    const total = data.ocupadas + sumNocupadas
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
    barNocupadas.innerHTML = sumNocupadas

    //Seleciona todos os botão de ocupação
    ocupButtons = document.querySelectorAll('#ocupacoes button')
    //Cria o evento de click em cada botão de ocupação
    ocupButtons.forEach((button) => button.addEventListener('click', handleOcupButtonClick))
  }
  //Clique no botão de cidade/campus
  campiButtons.forEach((button) => button.addEventListener('click', handleCampiButtonClick))

})
