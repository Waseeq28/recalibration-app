import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { useTheme } from "@/contexts/ThemeContext";
import { FileIcon } from "lucide-react-native";
import PdfViewer from "./components/PdfViewer";

export default function PdfScreen() {
  const { colors } = useTheme();
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      setPdfUri(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Stack.Screen options={{ title: "PDF Viewer" }} />

      {!pdfUri ? (
        <View className="flex-1 justify-center items-center px-5">
          <Text
            className="text-lg mb-5 text-center"
            style={{ color: colors.text.primary }}
          >
            Select a PDF file to view
          </Text>
          <TouchableOpacity
            onPress={pickDocument}
            className="flex-row items-center px-4 py-3 rounded-xl"
            style={{ backgroundColor: colors.surface.button }}
          >
            <FileIcon size={24} color={colors.text.secondary} />
            <Text
              className="ml-2.5 font-medium"
              style={{ color: colors.text.secondary }}
            >
              Select PDF
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <PdfViewer uri={pdfUri} />
      )}
    </View>
  );
}
