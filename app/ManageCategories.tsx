import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import categoryIcons from '@/constants/iconList';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import Colors from '@/constants/Colors'; // Assuming you have a Colors file for consistent color usage
import { CategorySelectorProps } from '@/assets/types';
import { useAppContext } from '@/context/AppContext';



const CategorySelector: React.FC<CategorySelectorProps> = ({ categoryType, setCategoryType }) => {
    const types = [
        { label: 'Expense', value: 'expense' },
        { label: 'Income', value: 'income' },
    ];

    return (
        <View style={styles.buttonContainer}>
            {types.map((type) => (
                <TouchableOpacity
                    key={type.value}
                    style={[
                        styles.iconButton,
                        categoryType === type.value && { backgroundColor: Colors.lightGray },
                    ]}
                    onPress={() => setCategoryType(type.value)}
                    accessibilityLabel={`Select ${type.label}`} // Accessibility label
                >
                    <Text style={styles.buttonText}>{type.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const ManageCategories = () => {    
    const { categories, setCategories } = useAppContext();
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<any>(null);
    const [categoryName, setCategoryName] = useState('');
    const [categoryType, setCategoryType] = useState('');
    const [categoryColor, setCategoryColor] = useState('#FFFFFF'); // Default color
    const [selectedIcon, setSelectedIcon] = useState<string>('');
    const [loading, setLoading] = useState(false); // State to manage loading status



    const openModal = (category = null) => {
        if (category) {
            setIsEditing(true);
            setCurrentCategory(category);
            setCategoryName(category.name);
            setCategoryColor(category.color);
            setSelectedIcon(category.icon);
            setCategoryType(category.type)
        } else {
            setIsEditing(false);
            setCategoryName('');
            setCategoryColor(getRandomColor());
            setSelectedIcon('');
            setCategoryType("");

        }
        setModalVisible(true);
    };
    const getRandomColor = (): string => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate a random hex color
        return `#${randomColor.padStart(6, '0')}`; // Ensure it is 6 digits
     ;

    }

    const updateCategory = async (db:any) => {
        const { id } = currentCategory; // Destructure for clarity
        await db.runAsync(`
            UPDATE categories
            SET 
                name = ?, 
                icon = ?, 
                color = ?, 
                type = ?, 
                start_date = ?, 
                end_date = ?
            WHERE id = ?;
        `, [categoryName, selectedIcon, categoryColor, categoryType, currentCategory.start_date, currentCategory.end_date, id]);
         // Update local state
        setCategories(categories.map(cat => 
            cat.id === id ? { ...cat, name: categoryName, categoryColor, icon: selectedIcon, type: categoryType } : cat
        ));
     ;
    }
    const addCategory = async (db: any) => {
        const defaultStartDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
        const defaultEndDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]; // One year from now
         await db.runAsync(`
            INSERT INTO categories (name, icon, color, type, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?);
        `, [categoryName, selectedIcon, categoryColor, categoryType, defaultStartDate, defaultEndDate]);
         // Add new category to local state
        const newCategory = {
            id: (categories.length + 1).toString(),
            name: categoryName,
            color:categoryColor,
            icon: selectedIcon,
            type: categoryType,
        };
        setCategories([...categories, newCategory]);
    
     ;
    }

    const handleSaveCategory = async () => {
        const dbPath = `${FileSystem.documentDirectory}sys.db`;
        const db = await SQLite.openDatabaseAsync(dbPath);
         try {
            if (isEditing) {
                await updateCategory(db);
            } else {
                await addCategory(db);
            }
        } catch (error) {
            console.error('Error saving category:', error);
            Alert.alert('Error', 'There was an issue saving the category. Please try again.');
        } finally {
            setModalVisible(false);
        }
     ;
    }

    const handleDeleteCategory = (id: string) => {
        console.log("id a suprimé memememememememememe", id)
        Alert.alert(
            "Delete Category",
            "Are you sure you want to delete this category? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: async () => await deleteCategoryFromDB(id) }
            ]
        );
    };

    const deleteCategoryFromDB = async (id: string) => {
        setLoading(true); // Set loading state to true
        try {
            const dbPath = `${FileSystem.documentDirectory}sys.db`;
            const db = await SQLite.openDatabaseAsync(dbPath);
            console.log('Deleting category with ID:', id);

            // Delete the category from the database
            await db.runAsync(`
                DELETE FROM categories
                WHERE id = ?;
            `, [id]);

            // Update local state to remove the deleted category
            console.log("before")
            console.log(categories)
            console.log("after")
            setCategories(categories.filter(cat => cat.ID !== id));
            Alert.alert("Success", "Category deleted successfully.");
            console.log(categories)
        } catch (error) {
            console.error('Error deleting category:', error.message);
            Alert.alert("Error", "There was an issue deleting the category. Please try again.");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const handleTransformToBudget = (id) => {
        // Logic to transform category into a budget
        Alert.alert("Transform", `Category ${id} transformed into a budget!`);

    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Categories</Text>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.categoryItem, { backgroundColor: item.color }]}>
                        <Ionicons name={item.icon} size={24} color="white" />
                        <Text style={styles.categoryName}>{item.name}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => openModal(item)}>
                                <Ionicons name="pencil-outline" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteCategory(item.ID)}>
                                <Ionicons name="trash-outline" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleTransformToBudget(item.id)}>
                                <Ionicons name="cash-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <Button title="Add Category" onPress={() => openModal()} color="#4CAF50" />
            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContent}>
                    <View style={{marginTop:50}}>
                        <TextInput
                            style={styles.input}
                            placeholder="Category Name"
                            value={categoryName}
                            onChangeText={setCategoryName}
                        />
                        <View>
                            <CategorySelector
                                categoryType={categoryType}
                                setCategoryType={setCategoryType}
                            />
                        </View>

                    </View>
                    <Text style={styles.iconTitle}>Select Icon:</Text>
                    <ScrollView style={{maxHeight:350,}}>
                        {Object.keys(categoryIcons).map((category) => (
                            <View key={category} style={styles.iconCategory}>
                                <Text style={styles.categoryLabel}>{category}</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {categoryIcons[category].map((icon) => (
                                        <TouchableOpacity
                                            key={icon.id}
                                            style={[styles.IconButton, selectedIcon === icon.name && { backgroundColor: Colors.lightGray }]}
                                            onPress={() => setSelectedIcon(icon.name as string)}
                                        >
                                            <Ionicons name={icon.name as string} size={30} color={selectedIcon === icon.name ? 'blue' : 'black'} />
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        ))}
                    </ScrollView>
                    <Button title={isEditing ? "Update Category" : "Add Category"} onPress={handleSaveCategory} />
                    <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF5722" />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    categoryItem: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryName: {
        fontSize: 18,
        color: 'white',
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    iconTitle: {
        fontSize: 16,
        marginVertical: 10,
    },
    iconCategory: {
        marginBottom: 20,
    },
    categoryLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    IconButton: {
        padding: 15,
        borderRadius: 12,
        marginRight: 10,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        minWidth: 100,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Space buttons evenly
        marginVertical: 10,
    },
    iconButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.darkGray, // Assuming you have a dark gray color defined
    },
    buttonText: {
        fontSize: 16,
        color: Colors.black, // Assuming you have a black color defined
    },
});

export default ManageCategories;
