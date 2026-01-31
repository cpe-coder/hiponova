import { Records } from "@/components";
import { images } from "@/constant/images";
import { useAuth } from "@/context/auth-context";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { format } from "date-fns";
import React from "react";

import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	SafeAreaView,
	Text,
	View,
} from "react-native";

export default function Home() {
	const [isChecking, setIsChecking] = React.useState(false);
	const [isLoadingMore, setIsLoadingMore] = React.useState(false);
	const navigation = useNavigation();
	const { userData } = useAuth();
	const [records, setRecords] = React.useState<any[]>([]);

	React.useEffect(() => {
		fetchContacts();
	});

	const fetchContacts = async () => {
		try {
			setIsChecking(true);

			const res = await axios.post(
				"https://ripe-sensei-server-9z7p.vercel.app/api/getRecords",
				{ email: userData?.email },
			);

			if (res.status === 200) {
				setRecords(res.data.data);
			} else {
				Alert.alert(`Error ${res.status}`, res.data.message || "Unknown error");
			}
		} catch (error: any) {
			console.error(error);
		} finally {
			setIsChecking(false);
		}
	};
	return (
		<>
			<SafeAreaView className="flex-1 bg-background">
				<View className="px-4 py-4">
					<Text className="text-5xl text-primary italic font-bold text-center">
						HipoNova
					</Text>
				</View>

				<Records
					rendered={
						<FlatList
							className="h-screen px-4"
							scrollEnabled={true}
							data={records}
							keyExtractor={(item, index) => `${item.id}-${index}`}
							renderItem={({ item }) => (
								<View className="flex-col mt-4 px-4 py-4 bg-[#02111f] gap-2 rounded-lg">
									<Text className="text-xl font-bold text-text mt-1">
										{format(new Date(item.createdAt), "PPpp")}
									</Text>
									<View className="flex-row justify-between items-center">
										<View className="flex-row items-center gap-1">
											<Text className="text-lg font-semibold text-secondary">
												Ripe: {item.ripe}
											</Text>
											<Text className="text-white text-lg font-semibold">
												%
											</Text>
										</View>
										<View className="flex-row gap-1 items-center">
											<Text className="text-lg font-semibold text-primary">
												Raw: {item.raw}
											</Text>
											<Text className="text-white text-lg font-semibold">
												%
											</Text>
										</View>
									</View>
								</View>
							)}
							onEndReachedThreshold={0.5}
							ListFooterComponent={
								isLoadingMore ? (
									<View className="py-4">
										<ActivityIndicator size="large" color="#00ffb2" />
									</View>
								) : null
							}
							ListEmptyComponent={() =>
								isChecking ? (
									<View className="">
										<Text className="text-gray-500 mt-4 text-lg">
											Loading data...
										</Text>
										<View className="p-6 items-center justify-center">
											<ActivityIndicator size="large" color="#00ffb2" />
										</View>
									</View>
								) : (
									<View className="">
										<Text className="text-gray-500 mt-4 text-lg">
											Empty records
										</Text>
										<View className="p-6 items-center justify-center">
											<Image
												className="w-28 h-28"
												resizeMode="contain"
												source={images.Empty}
											/>
										</View>
									</View>
								)
							}
						/>
					}
				/>
			</SafeAreaView>
		</>
	);
}
