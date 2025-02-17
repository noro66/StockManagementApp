import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "./styles";

interface RestockModalProps {
  visible: boolean;
  amount: string;
  onChangeAmount: (amount: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  mode: string,
}

export const RestockModal: React.FC<RestockModalProps> = ({
  visible,
  amount,
  onChangeAmount,
  onConfirm,
  onCancel,
  mode,
}) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{mode.charAt(0).toUpperCase() + mode.slice(1)} Product</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="Enter quantity"
          keyboardType="numeric"
          value={amount}
          onChangeText={onChangeAmount}
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.confirmButton]}
            onPress={onConfirm}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
