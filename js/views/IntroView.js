class IntroView extends View {
	constructor(data) {
		super();
	}

	init() {
        $("#intro-box").append(`<h2 class='m-1'>Introduction</h2><br></br>`)
        $("#intro-box").append(`
        <p>
            One of the major challenges of our time and for the Netherlands, is the energy transition. 
            With the posed goals of a CO2 reduction of 55% in 2030, and CO2 neutrality in 2050, there is a big need for a collective effort of not only national instances, 
            but also regional instances.
        </p>
        <p> 
            These efforts require therefore also comprehensive overview of the current state of the country concerning CO2 emissions, support for climate policy, 
            and usage of sustainable energy sources. To support this endeavour, we have developed a visualisation tool for policymakers on regional and national levels, 
            as well as other interested parties to explore the current status of the Netherlands concerning energy transition, and to identify bottlenecks and opportunities. 
        </p>`)
        $("#intro-box").append(`
        <ul>
            <li> 
                In the <strong>CO2</strong> tab you can find an overview of CO2 emissions per inhabitant of different municipalities in the Netherlands. 
                These CO2 emissions are divided in four categories: emissions by transport, agriculture, built environment and industry.
            </li> 
            <li> 
                In the <strong>Renewable Energy</strong> tab you can find an overview of the fractions of energy used by municipalities that is produced in a renewable fashion.
            </li>
            <li>
                In the <strong>Political Parties</strong> tab you can find an overview of support for climate policy based on the results of the Dutch General Elections of 2021. 
                This support is based on the perentages of votes in a municipality on parties assigned to a certain climate label as has been described by the <a href="https://www.klimaatlabelpolitiek.nl/">KlimaatLabel</a>.
            </li>
            <li>
                In the <strong>Aggregate</strong> tab you can find an overview of an aggregation over all the three sustainability dimensions.
            </li>
            <li>
                The municipality selected in the <strong>Main municipality selected</strong> dropdown is the municipality that will, as the name says, be the municipality selected even if moving to other tabs!
            </li>
        </ul>`)
        $("#intro-box").append(`
        <p>
            All elements of this visualisation are purposefully interactable, as to help in discovering insights into the current status of the Netherlands concerning the energy transition. Use them and have fun :-).
        </p>
        <p>
            This visualisation has been made as an assignment for the IN4089 Data Visualisation course at the TU Delft by Jeroen Nelen, Marijn Roelvink and Arian Joyandeh.
        </p>
        `)

        $("#intro-box").append(`
        <h5>
            Sources
        </h5>
        <ul>
            <li>
                <a href="https://klimaatmonitor.databank.nl/jive">CO2 Emissions data (2019) and Renewable Energy data (2019)</a>.
            </li>
            <li>
                <a href="https://www.verkiezingsuitslagen.nl/">Dutch General Election 2021 results per municipality</a>.
            </li>
            <li>
                <a href="https://www.uitvoeringvanbeleidszw.nl/subsidies-en-regelingen/veranderopgave-inburgering-pilots/tabel-aantal-inwoners-gemeenten-per-1-januari-2019">Inhabitants per municipality (2019)</a>.
            </li>
            <li>
                <a href="https://www.klimaatlabelpolitiek.nl/">KlimaatLabel</a>.
            </li>
        </ul>
        `)
        this.isInitialized = true
    }

    update() {
		if (!this.isInitialized) {
			this.init();
			this.isInitialized = true;
		} else {
		}
	}
}