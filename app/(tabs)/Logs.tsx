import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function Logs() {
	const scheduleLogs = Array.from({ length: 15 }, (_, i) => ({
		id: i + 1,
		createdAt: `2026-02-04 ${8 + i}:00`,
		scheduleDate: `2026-02-0${(i % 6) + 4}`,
		status: ["Pending", "Processing", "Completed"][i % 3],
	}));

	const loginLogs = Array.from({ length: 12 }, (_, i) => ({
		id: i + 1,
		timestamp: `2026-02-04 ${8 + i}:05`,
		user: `user${i + 1}@email.com`,
		action: "Login",
		active: i % 2 === 0,
	}));

	const tableHeight = 300;

	return (
		<ScrollView className="flex-1 bg-gray-50 px-4 py-4">
			<Text className="text-2xl font-bold text-primary mb-3">
				Schedule Logs
			</Text>
			<View className="border rounded-lg overflow-hidden mb-8">
				<View className="flex-row bg-gray-200 p-2">
					<Text className="flex-1 font-semibold">Created At</Text>
					<Text className="flex-1 font-semibold">Schedule Date</Text>
					<Text className="flex-2 font-semibold">Status</Text>
				</View>

				<ScrollView
					style={{ maxHeight: tableHeight }}
					contentContainerStyle={{}}
				>
					{scheduleLogs.map((log) => (
						<View key={log.id} className="flex-row border-b p-2 bg-white">
							<Text className="flex-1">{log.createdAt}</Text>
							<Text className="flex-1">{log.scheduleDate}</Text>
							<Text className="flex-2">{log.status}</Text>
						</View>
					))}
				</ScrollView>
			</View>

			<Text className="text-2xl font-bold mb-3 text-primary">
				User Login Logs
			</Text>
			<View className="border rounded-lg overflow-hidden mb-8">
				<View className="flex-row bg-gray-200 p-2">
					<Text className="flex-1 font-semibold">Timestamp</Text>
					<Text className="flex-1 font-semibold">User</Text>
					<Text className="flex-2 font-semibold">Action</Text>
				</View>

				<ScrollView style={{ maxHeight: tableHeight }}>
					{loginLogs.map((log) => (
						<View key={log.id} className="flex-row border-b p-2 bg-white">
							<Text className="flex-1">{log.timestamp}</Text>
							<Text className="flex-1">{log.user}</Text>
							<Text
								className={`flex-2 font-bold ${
									log.active ? "text-green-600" : "text-red-500"
								}`}
							>
								{log.active ? "Active" : "Logout"}
							</Text>
						</View>
					))}
				</ScrollView>
			</View>
		</ScrollView>
	);
}
