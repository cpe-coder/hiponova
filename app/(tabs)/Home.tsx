import React from "react";

import { SafeAreaView, Text, View } from "react-native";

export default function Home() {
	return (
		<>
			<SafeAreaView className="flex-1 bg-gray-50">
				<View className="px-4 py-4">
					<Text className="text-5xl text-secondary italic font-bold text-center">
						HipoNova
					</Text>
				</View>
			</SafeAreaView>
		</>
	);
}
