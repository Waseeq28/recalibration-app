import React, { useState } from "react";
import { View, Dimensions, ActivityIndicator, Text } from "react-native";
import Pdf from "react-native-pdf";
import { useTheme } from "@/contexts/ThemeContext";

interface PdfViewerProps {
  uri: string;
}

export default function PdfViewer({ uri }: PdfViewerProps) {
  const { colors } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showCounter, setShowCounter] = useState(true);

  const renderActivityIndicator = () => (
    <View className="absolute inset-0 flex items-center justify-center z-10">
      <ActivityIndicator size="large" color={colors.text.accent} />
    </View>
  );

  const handleError = (error: object) => {
    console.error("PDF Error:", error);
  };

  const handlePageChange = (page: number, pageCount: number) => {
    setCurrentPage(page);
    if (totalPages === 0) {
      setTotalPages(pageCount);
    }
  };

  const handleLoadComplete = (numberOfPages: number) => {
    setTotalPages(numberOfPages);
  };

  const handleSingleTap = () => {
    setShowCounter(!showCounter);
  };

  return (
    <View className="flex-1">
      <Pdf
        source={{ uri }}
        enablePaging={true}
        renderActivityIndicator={renderActivityIndicator}
        onError={handleError}
        onPageChanged={handlePageChange}
        onLoadComplete={handleLoadComplete}
        onPageSingleTap={handleSingleTap}
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
      />

      {totalPages > 0 && showCounter && (
        <View className="absolute bottom-4 left-0 right-0 flex items-center">
          <View className="bg-black bg-opacity-70 px-3 py-1 rounded-full">
            <Text className="text-white text-sm">
              {currentPage} / {totalPages}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
