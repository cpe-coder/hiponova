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
	const [temperature, setTemperature] = useState<number | null>(null);
	const [timerMinutes, setTimerMinutes] = useState("");
	const [remainingSeconds, setRemainingSeconds] = useState(0);
	const [isDehydrating, setIsDehydrating] = useState(false);
	const [isGrinding, setIsGrinding] = useState(false);
	const [starting, setStartingState] = useState(false);

	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const isStartingRef = useRef(false);

	const startDehydrating = async () =>
		await set(ref(database, "device/dehydrating"), true);
	const stopDehydrating = async () =>
		await set(ref(database, "device/dehydrating"), false);
	const setStarting = async (value: boolean) =>
		await set(ref(database, "controls/starting"), value);
	const setCancel = async (value: boolean) =>
		await set(ref(database, "controls/cancel"), value);
	const setGrinding = async (value: boolean) =>
		await set(ref(database, "device/grinding"), value);

	useEffect(() => {
		const unsubTemp = onValue(
			ref(database, "sensor/temperature"),
			(snapshot) => {
				const value = snapshot.val();
				if (typeof value === "number") setTemperature(Number(value.toFixed(2)));
				else setTemperature(null);
			},
		);

		const unsubDehydrating = onValue(
			ref(database, "device/dehydrating"),
			(snapshot) => {
				setIsDehydrating(snapshot.val());
			},
		);

		const unsubGrinding = onValue(
			ref(database, "device/grinding"),
			(snapshot) => {
				setIsGrinding(snapshot.val());
			},
		);

		const unsubStarting = onValue(
			ref(database, "controls/starting"),
			(snapshot) => {
				setStartingState(snapshot.val());
			},
		);

		const unsubCancel = onValue(
			ref(database, "controls/cancel"),
			async (snapshot) => {
				const value = snapshot.val();
				if (value === true && !isStartingRef.current) {
					await cancelTimer();
				}
			},
		);

		return () => {
			unsubTemp();
			unsubDehydrating();
			unsubGrinding();
			unsubStarting();
			unsubCancel();
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	const adjustTimer = (deltaSeconds: number) => {
		setRemainingSeconds((prev) => {
			const updated = prev + deltaSeconds;
			return updated > 0 ? updated : 0;
		});
	};
	const startTimer = async () => {
		const minutes = Number(timerMinutes);
		if (!minutes || minutes <= 0) return;

		isStartingRef.current = true;

		await setCancel(false);
		await setStarting(true);

		const totalSeconds = minutes * 60;
		setRemainingSeconds(totalSeconds);
		setIsDehydrating(true);

		await startDehydrating();

		intervalRef.current = setInterval(async () => {
			setRemainingSeconds((prev) => {
				if (prev <= 1) {
					clearInterval(intervalRef.current!);
					intervalRef.current = null;

					setIsDehydrating(false);
					stopDehydrating(); // update Firebase
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		setTimeout(() => {
			isStartingRef.current = false;
		}, 500);
	};

	const cancelTimer = async () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		setRemainingSeconds(0);
		setIsDehydrating(false);

		await stopDehydrating();
		await setStarting(false);
		await setCancel(true); // only user cancel triggers this

		setTimeout(async () => {
			await setCancel(false);
		}, 10000);
	};

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

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
					editable={!isDehydrating}
					className="border rounded px-3 py-2 bg-white mb-3"
				/>

				{isDehydrating && (
					<View className="items-center mb-4">
						<Text className="text-3xl font-bold mb-3">
							{formatTime(remainingSeconds)}
						</Text>

						<View className="flex-row gap-4">
							<TouchableOpacity
								onPress={() => adjustTimer(-60)}
								className="bg-orange-500 px-4 py-2 rounded"
							>
								<Text className="text-white font-bold">-1 min</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => adjustTimer(60)}
								className="bg-green-600 px-4 py-2 rounded"
							>
								<Text className="text-white font-bold">+1 min</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}

				<TouchableOpacity
					onPress={startTimer}
					disabled={isDehydrating || !starting} // ✅ disable if dehydrating OR starting is false
					className={`py-3 rounded ${
						isDehydrating || !starting ? "bg-gray-400" : "bg-blue-600"
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
