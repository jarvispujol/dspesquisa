import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filters from '../../components/filters';
import './styles.css';
import { barOptions, pieOptions } from './chart-options';
import Chart from 'react-apexcharts';
import { buildBarSeries, getPlatformChartData, getGenderChartData } from './helpers';

const BASE_URL = 'https://sds1-jarvis.herokuapp.com';

type PieChartData = {
	labels: string[];
	series: number[];
}

type BarChartData = {
	x: string;
	y: number;
}

const initaiPiaData = {
	labels: [],
	series: []
}


const Charts = () => {

	const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
	const [platformData, setPlatformData] = useState<PieChartData>(initaiPiaData);
	const [genderData, setGenderData] = useState<PieChartData>(initaiPiaData);

	useEffect(() => {
		async function getData(){
			const recordsResponse = await axios.get(`${BASE_URL}/records`);
			const gamesResponse = await axios.get(`${BASE_URL}/games`);

			const barData = buildBarSeries(gamesResponse.data, recordsResponse.data.content);
			setBarChartData(barData);

			const platformChartData = getPlatformChartData(recordsResponse.data.content);
			setPlatformData(platformChartData);

			const genderChartData = getGenderChartData(recordsResponse.data.content);
			setGenderData(genderChartData);
		}
		getData();
	}, []);

	return ( 
		<div className="page-container">
			<Filters link="/records" linkText="ver Tabela"/>
			<div className="chart-container">
				<div className="top-related">
					<h1 className="top-related-title">Jogos mais Votados</h1>
					<div className="games-container">
						<Chart 
							options={barOptions}
							type="bar"
							width="900"
							height="600"
							series={[{data: barChartData}]}
						/>
					</div>
				</div>
				<div className="charts">
					<div className="platform-chart">
						<h2 className="chart-title">Plataformas</h2>
						<Chart
							options={{...pieOptions, labels:platformData?.labels}}
							type="donut"
							width="350"
							series={platformData?.series}
						/>
					</div>
					<div className="gender-chart">
						<h2 className="chart-title">Gêneros</h2>
						<Chart
							options={{...pieOptions, labels:genderData?.labels}}
							type="donut"
							width="350"
							series={genderData?.series}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Charts;