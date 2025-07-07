import React, { useState } from "react";
import CustomButton from "../general/CustomButton";
import { Modal, Pressable, StyleSheet } from "react-native";
import { Text, TextInput, View } from "../general/Themed";
import Card from "../general/Card";
import { AntDesign } from "@expo/vector-icons";
import exercises from "@/data/exercises";
import { FlatList } from "react-native-gesture-handler";

export default function SelectExerciseModal({
  onSelectExercise,
}: {
  onSelectExercise: (name: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <CustomButton title="Select Exercise" onPress={() => setIsOpen(true)} />
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.overlay}>
          <Card title="Select Exercise" style={styles.modalContent}>
            <AntDesign
              name="close"
              size={20}
              color={"gray"}
              style={styles.closeButton}
              onPress={() => setIsOpen(false)}
            />
            <TextInput
              placeholder="Search exercise"
              onChangeText={setSearch}
              value={search}
              style={styles.input}
            />
            <FlatList
              data={filteredExercises}
              contentContainerStyle={{ gap: 20 }}
              renderItem={({ item }) => (
                <Pressable
                  key={item.id}
                  style={{ gap: 20 }}
                  onPress={() => {
                    onSelectExercise(item.name);
                    setIsOpen(false);
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                  <Text style={{ color: "gray" }}>{item.muscle}</Text>
                </Pressable>
              )}
            />
          </Card>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  modalContent: {
    width: "90%",
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  input: { padding: 10, marginVertical: 10 },
});
