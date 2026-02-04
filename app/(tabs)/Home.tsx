import React, { useEffect, useRef, useState } from "react";
import {
	SafeAreaView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import database from "@/utils/firebase.config";
import { onValue, ref, set } from "firebase/database";

export default function Home() {
	// STATES
	const [temperature, setTemperature] = useState<number | null>(null);
	const [timerMinutes, setTimerMinutes] = useState("");
	const [remainingSeconds, setRemainingSeconds] = useState(0);
	const [isDehydrating, setIsDehydrating] = useState(false);
	const [isGrinding, setIsGrinding] = useState(false);

	const intervalRef = useRef<number | null>(null);

	const startDehydrating = async () => {
		await set(ref(database, "device/dehydrating"), true);
	};

	const stopDehydrating = async () => {
		await set(ref(database, "device/dehydrating"), false);
	};

	const setGrinding = async (value: boolean) => {
		await set(ref(database, "device/grinding"), value);
	};

	const getTemperature = () =>
		onValue(ref(database, "sensor/temperature"), (snapshot) => {
			setTemperature(snapshot.val());
		});

	const getDehydratingStatus = () =>
		onValue(ref(database, "device/dehydrating"), (snapshot) => {
			setIsDehydrating(snapshot.val());
		});

	const getGrindingStatus = () =>
		onValue(ref(database, "device/grinding"), (snapshot) => {
			setIsGrinding(snapshot.val());
		});

	const startTimer = async () => {
		const minutes = Number(timerMinutes);
		if (!minutes || minutes <= 0) return;

		const totalSeconds = minutes * 60;
		setRemainingSeconds(totalSeconds);

		await startDehydrating();

		intervalRef.current = setInterval(() => {
			setRemainingSeconds((prev) => {
				if (prev <= 1) {
					cancelTimer();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const cancelTimer = async () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setRemainingSeconds(0);
		await stopDehydrating();
	};

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

	useEffect(() => {
		const unsubTemp = getTemperature();
		const unsubDehydrating = getDehydratingStatus();
		const unsubGrinding = getGrindingStatus();

		return () => {
			unsubTemp();
			unsubDehydrating();
			unsubGrinding();
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	return (
		<SafeAreaView className="flex-1 bg-gray-50 px-4">
			<View className="py-4">
				<Text className="text-5xl text-primary italic font-bold text-center">
					HipoNova
				</Text>
			</View>

			<View className="my-6 items-center">
				<Text className="text-xl font-semibold">Temperature</Text>
				<Text className="text-4xl mt-2 font-medium">
					{temperature !== null ? `${temperature} °C` : "Loading..."}
				</Text>
			</View>

			<View className="my-6">
				<Text className="text-lg font-semibold mb-2">
					Dehydration Timer (minutes)
				</Text>

				<TextInput
					value={timerMinutes}
					onChangeText={setTimerMinutes}
					keyboardType="numeric"
					placeholder="Enter minutes"
					editable={!isDehydrating}
					className="border rounded px-3 py-2 bg-white mb-3"
				/>

				{isDehydrating && (
					<Text className="text-center text-3xl font-bold mb-3">
						{formatTime(remainingSeconds)}
					</Text>
				)}

				<TouchableOpacity
					onPress={startTimer}
					disabled={isDehydrating}
					className={`py-3 rounded ${
						isDehydrating ? "bg-gray-400" : "bg-blue-600"
					}`}
				>
					<Text className="text-white text-center font-bold">Start Timer</Text>
				</TouchableOpacity>

				{isDehydrating && (
					<TouchableOpacity
						onPress={cancelTimer}
						className="py-3 rounded bg-red-600 mt-3"
					>
						<Text className="text-white text-center font-bold">Cancel</Text>
					</TouchableOpacity>
				)}

				{isDehydrating && (
					<Text className="text-center text-red-600 font-bold mt-3">
						Dehydrating...
					</Text>
				)}
			</View>

			<View className="mt-auto mb-10">
				<TouchableOpacity
					onPress={() => setGrinding(!isGrinding)}
					className={`py-4 rounded ${
						isGrinding ? "bg-green-600" : "bg-red-600"
					}`}
				>
					<Text className="text-white text-center font-bold text-lg">
						{isGrinding ? "Grinding ON" : "Grinding OFF"}
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
