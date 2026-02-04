import { developers } from "@/constant/developers";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

export default function Teams() {
	const developer = [
		{
			id: 1,
			name: "Lealyn E. De Lara",
			role: "Lead Technical Writer",
			image: developers.dev4,
		},
		{
			id: 2,
			name: "Aira A. Fabrero",
			role: "Hardware Designer",
			image: developers.dev2,
		},
		{
			id: 3,
			name: "Britney F. Formal",
			role: "Lead Developer",
			image: developers.dev1,
		},
		{
			id: 4,
			name: "John Andrew A. Gamboa",
			role: "Lead Programmer",
			image: developers.dev3,
		},
	];

	return (
		<ScrollView className="flex-1 bg-gray-50 px-4 py-6">
			<View className="mb-8">
				<Text className="text-xl text-primary font-bold mb-2">
					Our Innovation
				</Text>
				<Text className="text-secondary">
					HiponNOVA is an IiT-Based Machine for shrimp waste powdering and
					seasoning, designed to automate, optimize, and improve the processing
					of shrimp waste into high-quality powdered seasoning through smart
					technology and real-time monitoring.
				</Text>
			</View>

			<View>
				<Text className="text-xl font-bold mb-4">Developers</Text>
				{developer.map((dev) => (
					<View
						key={dev.id}
						className="flex-row items-center mb-4 bg-white p-3 rounded-lg shadow"
					>
						<Image
							source={dev.image}
							className="w-16 h-16 rounded-full mr-4"
							style={{ width: 64, height: 64, borderRadius: 32 }}
						/>

						<View className="flex-1">
							<Text className="text-lg font-semibold">{dev.name}</Text>
							<Text className="text-gray-500">{dev.role}</Text>
						</View>
					</View>
				))}
			</View>
		</ScrollView>
	);
}
