import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../contexts/UserContext"; // Updated path
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext"; // Updated path
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useUser();
  const router = useRouter();
  const { theme, setAccentColor, toggleTheme } = useTheme();
  const [uploading, setUploading] = useState(false);

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/logoutScreen");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Something went wrong while logging out.");
    }
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload photos!',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await handleImageSelect(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await handleImageSelect(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleImageSelect = async (uri) => {
    setUploading(true);
    try {
      // Convert image to base64 or upload to your server
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Create data URL for display
      const imageDataUrl = `data:image/jpeg;base64,${base64}`;
      
      // Update user profile with new image
      await updateProfile({
        profilePicture: imageDataUrl,
        profilePictureUri: uri, // Store URI for local access
      });
      
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Update Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Library',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const getImageSource = () => {
    if (user?.profilePicture) {
      return { uri: user.profilePicture };
    }
    if (user?.profilePictureUri) {
      return { uri: user.profilePictureUri };
    }
    return require("../../assets/images/default-avatar.png");
  };

  // Classy-cutesy student palette
  const colors = ["#5A8DEE", "#FFB6C1", "#CBA6F7", "#A3E3D6", "#FFE066"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={showImagePickerOptions} disabled={uploading}>
            <View style={styles.avatarContainer}>
              <Image
                source={getImageSource()}
                style={[styles.avatar, { borderColor: theme.colors.primary, borderWidth: 2 }]}
              />
              {uploading && (
                <View style={styles.uploadOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
              <View style={styles.cameraIconContainer}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <Text style={[styles.userName, { color: theme.colors.text }]}>{user.username}</Text>
          <Text style={[styles.userEmail, { color: theme.colors.text }]}>{user.email}</Text>
          
          <TouchableOpacity 
            style={[styles.uploadButton, { backgroundColor: theme.colors.primary }]}
            onPress={showImagePickerOptions}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.uploadButtonText}>Change Photo</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Account Information */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account Information</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Username:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{user.username}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Email:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{user.email}</Text>
          </View>
        </View>

        {/* Theme Customization */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Customize Theme</Text>
          
          <Text style={[styles.infoLabel, { color: theme.colors.text, marginBottom: 15 }]}>
            Choose accent color:
          </Text>
          <View style={styles.colorsContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  theme.colors.primary.toLowerCase() === color.toLowerCase() && styles.selectedColor,
                ]}
                onPress={() => setAccentColor(color)}
              />
            ))}
          </View>
          
          <TouchableOpacity
            style={[styles.toggleButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}
            onPress={toggleTheme}
          >
            <Text style={[styles.toggleButtonText, { color: theme.colors.text }]}>
              Switch to {theme.isDark ? "Light" : "Dark"} Mode
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Pressable
            style={[styles.logoutButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleLogout}
          >
            <Text style={[styles.logoutText, { color: "#fff" }]}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileHeader: { 
    alignItems: "center", 
    marginBottom: 24,
    paddingVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: "#fff", 
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cameraIcon: {
    fontSize: 16,
  },
  userName: { 
    fontSize: 24, 
    fontWeight: "700",
    marginBottom: 4,
    marginTop: 8,
  },
  userEmail: { 
    fontSize: 16, 
    opacity: 0.7,
    marginBottom: 16,
  },
  uploadButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  infoSection: { 
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  logoutSection: {
    marginTop: 24,
    marginBottom: 40,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 16,
  },
  infoRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoLabel: { 
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: { 
    fontSize: 14, 
    fontWeight: "500",
    opacity: 0.8,
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: { 
    fontSize: 16, 
    fontWeight: "600" 
  },
  colorsContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  colorCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginHorizontal: 6,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  selectedColor: { 
    borderWidth: 3, 
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
    transform: [{ scale: 1.1 }] 
  },
  toggleButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
  },
  toggleButtonText: {
    fontWeight: "600", 
    fontSize: 14,
  },
});