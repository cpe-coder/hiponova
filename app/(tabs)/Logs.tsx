import { API_URL, useAuth } from "@/context/auth-context";
import axios from "axios";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const formatManilaTime = (date: string | null) => {
	if (!date) return "-";

	return new Date(date).toLocaleString("en-PH", {
		timeZone: "Asia/Manila",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});
};

export default function Logs() {
	const { authState } = useAuth();
	const [logs, setLogs] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!authState?.authenticated) return;

		const fetchLogs = async () => {
			try {
				const res = await axios.get(`${API_URL}/api/logs/login`);
				setLogs(res.data);
			} catch (error) {
				console.log("Failed to load logs:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchLogs();
	}, [authState?.authenticated]);

	if (!authState?.authenticated) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-50">
				<Text className="text-gray-500">Please login to view logs</Text>
			</View>
		);
	}

	if (loading) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-50">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<ScrollView className="flex-1 bg-gray-50 px-4 py-4">
			<Text className="text-2xl font-bold mb-4 text-primary">
				User Login Logs
			</Text>

			<View className="border border-primary rounded-md overflow-hidden">
				<View className="flex-row bg-gray-200 p-2">
					<Text className="flex-1 text-sm font-medium">Email</Text>
					<Text className="flex-1 text-sm font-medium">Login</Text>
					<Text className="flex-1 text-sm font-medium">Logout</Text>
					<Text className="flex-1 text-sm font-medium">Status</Text>
				</View>

				{logs.map((log) => (
					<View key={log._id} className="flex-row border-b p-1 bg-white">
						<Text className="flex-1 text-xs">{log.email}</Text>
						<Text className="flex-1 text-xs">
							{formatManilaTime(log.loginTime)}
						</Text>

						<Text className="flex-1 text-xs">
							{formatManilaTime(log.logoutTime)}
						</Text>

						<Text
							className={`flex-1 text-xs font-bold ${
								log.status === "ACTIVE" ? "text-green-600" : "text-red-500"
							}`}
						>
							{log.status}
						</Text>
					</View>
				))}
			</View>
		</ScrollView>
	);
}
