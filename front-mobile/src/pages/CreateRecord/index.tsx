import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import Header from '../../components/Header';
import PlatformCard from './PlatformCard';
import { Game, GamePlatform } from './types';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome5 as Icon } from '@expo/vector-icons';
import axios from 'axios';
import { RectButton } from 'react-native-gesture-handler';

const gamePlaceholder = {
	label: 'Selecione o game',
	value: null
}

const BASE_URL = 'http://192.168.0.27:8080/'

const mapSelectValues = (games: Game[]) => {
	return games.map(game => ({
		...game,
		label: game.title,
		value: game.id
	}))
} 

const CreateRecord = () => {

	const [name, setName] = useState('');
	const [age, setAge] = useState('');
	const [platform, setPlatform] = useState<GamePlatform>();
	const [selectedGame, setSelectedGame] = useState('');
	const [gameList, setGameList] = useState<Game[]>([]);
	const [platformGames, setPlatformGames] =useState<Game[]>([])

	const handleChangePlatform = (selectedPlatform: GamePlatform) => {
		setPlatform(selectedPlatform);
		const gamesByPlatform = gameList.filter( game => game.platform === selectedPlatform);
		setPlatformGames(gamesByPlatform);
	}

	useEffect(() => {
		axios.get(`${BASE_URL}games`)
		.then(response => {
			const selectValues = mapSelectValues(response.data)
			setGameList(selectValues);
		})
		.catch(() => {Alert.alert('Ocurreo um erro ao listar os games da plataforma selecionada')});
	});

	const handleSubmit = () => {
		const dados = { name, age, gameId: selectedGame	}
		axios.post(`${BASE_URL}records`, dados)
		.then(() => {
			Alert.alert('Dados Salvos com sucesso!');
			setName('');
			setAge('');
			setSelectedGame('');
			setPlatform(undefined);
		})
		.catch(() => {Alert.alert('Ocurreo um erro ao salvar os dados')});
	}

	return (
		<>
			<Header/>
			<View style={styles.container}>
				<TextInput 
					style={styles.inputText}
					placeholder="Nome"
					placeholderTextColor="#9E9E9E"
					onChangeText={name => setName(name)}
					value={name}
				/>
				<TextInput 
					keyboardType="numeric"
					style={styles.inputText}
					placeholder="idade"
					placeholderTextColor="#9E9E9E"
					maxLength={3}
					onChangeText={age => setAge(age)}
					value={age}
				/>
				<View style={styles.platformContainer}>
					<PlatformCard 
						platform="XBOX"
						icon="xbox"
						onChange={ handleChangePlatform}
						activePlatform={platform}
					/>
					<PlatformCard 
						platform="PC"
						icon="laptop"
						onChange={handleChangePlatform}
						activePlatform={platform}
					/>
					<PlatformCard 
						platform="PLAYSTATION"
						icon="playstation"
						onChange={handleChangePlatform}
						activePlatform={platform}
					/>
				</View>
				<RNPickerSelect 
					placeholder={gamePlaceholder}
					onValueChange={value => {
						setSelectedGame(value);
					}}
					value={selectedGame}
					items={platformGames}
					style={pickerSelecStyles}
					Icon={() => {
						return <Icon name="chevron-down" color="#9E9E9E" size={25}/>
					}}
				/>
				<View style={styles.footer}>
					<RectButton style={styles.button} onPress={handleSubmit}>
						<Text style={styles.buttonText}>SALVAR</Text>
					</RectButton>
				</View>
			</View>
		</>
	);
}

const pickerSelecStyles = StyleSheet.create({
	inputIOS: {
	  fontSize: 16,
	  paddingVertical: 12,
	  paddingHorizontal: 20,
	  backgroundColor: '#FFF',
	  borderRadius: 10,
	  color: '#ED7947',
	  paddingRight: 30,
	  fontFamily: "Play_700Bold",
	  height: 50
	},
	inputAndroid: {
	  fontSize: 16,
	  paddingVertical: 12,
	  paddingHorizontal: 20,
	  backgroundColor: '#FFF',
	  borderRadius: 10,
	  color: '#ED7947',
	  paddingRight: 30,
	  fontFamily: "Play_700Bold",
	  height: 50
	},
	placeholder: {
	  color: '#9E9E9E',
	  fontSize: 16,
	  fontFamily: "Play_700Bold",
	},
	iconContainer: {
	  top: 10,
	  right: 12,
	}
  });

const styles = StyleSheet.create({
	container: {
	  marginTop: '15%',
	  paddingRight: '5%',
	  paddingLeft: '5%',
	  paddingBottom: 50
	},
	inputText: {
	  height: 50,
	  backgroundColor: '#FFF',
	  borderRadius: 10,
	  color: '#ED7947',
	  fontFamily: "Play_700Bold",
	  fontSize: 16,
	  paddingLeft: 20,
	  marginBottom: 21
	},
	platformContainer: {
	  marginBottom: 20,
	  flexDirection: 'row',
	  justifyContent: 'space-between',
	},
	footer: {
	  marginTop: '15%',
	  alignItems: 'center',
	},
	button: {
	  backgroundColor: '#00D4FF',
	  flexDirection: 'row',
	  borderRadius: 10,
	  height: 60,
	  width: '100%',
	  alignItems: 'center',
	  justifyContent: 'center'
	},
	buttonText: {
	  fontFamily: "Play_700Bold",
	  fontWeight: 'bold',
	  fontSize: 18,
	  color: '#0B1F34',
	}
  });

export default CreateRecord;