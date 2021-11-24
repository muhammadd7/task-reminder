import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Button,
  TextInput,
  View,
  SafeAreaView,
  TextInputBase,
  Touchable,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ReactNativeAN from 'react-native-alarm-notification';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { openDatabase } from 'react-native-sqlite-storage';
import Tts from 'react-native-tts';
const Tab = createBottomTabNavigator();

var db = openDatabase({name: 'Reminder.db'});

function HomeScreen() {
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Task'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS Task', []);
            console.log('in insertData');
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Task(Key INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT, Detail TEXT, RDate TEXT, RTime TEXT)',
              []
            );
          }
        }
      );
    })

  }, []);

  return (
    
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        activeTintColor: 'grey',
        inactiveTintColor: 'lightgray',
        activeBackgroundColor: '#7070A8',
        inactiveBackgroundColor: '#7070A8',
      }}>
      <Tab.Screen
        name="Add Tasks"
        component={AddTasks}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('./android/app/src/main/Images/AddTask.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#FFCA3C' : 'black',
                }}
              />
              <Text
                style={{
                  color: focused ? '#FFCA3C' : 'black',
                  fontSize: 12,
                }}>
                Add Tasks
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="My Tasks"
        component={MyTasks}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('./android/app/src/main/Images/ViewTask.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#FFCA3C' : 'black',
                }}
              />
              <Text
                style={{
                  color: focused ? '#FFCA3C' : 'black',
                  fontSize: 12,
                }}>
                My Tasks
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export const AddTasks = ({navigation}) => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('Empty');
  const [udate, setUdate] = useState('');
  const [mytime, setMytime] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('Empty');

  const insertData = () => {
    if (title == '' || udate == '' || mytime == '') {
      Alert.alert('Please Enter All the Values');
    } else {
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO Task (Title, Detail, RDate, RTime) VALUES (?,?,?,?)',
          [title, description, udate, mytime],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert('Data Inserted Successfully....');
            } else Alert.alert('Failed....');
          }
        );
      });
    }
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      '-' +
      (tempDate.getMonth() + 1) +
      '-' +
      tempDate.getFullYear();
    let fTime =
      tempDate.getHours() +
      ':' +
      tempDate.getMinutes() +
      ':' +
      tempDate.getSeconds();
    setText(fDate + ' ' + fTime);
    setUdate(fDate);
    setMytime(fTime);
    console.log(udate);
    console.log(mytime);
    console.log(title);
    console.log(description);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F1E30',
      }}>
      <TextInput
        onChangeText={tit => setTitle(tit)}
        placeholder="Add Task Title"
        placeholderTextColor="white"
        style={{
          width: 300,
          borderWidth: 1,
          borderRadius: 90,
          backgroundColor: '#373753',
          textAlign: 'center',
        }}
      />
      <TextInput
        onChangeText={desc => setDescription(desc)}
        placeholder="Add Task Description"
        placeholderTextColor="white"
        style={{
          width: 300,
          height: 50,
          borderWidth: 1,
          borderRadius: 90,
          marginTop: 20,
          backgroundColor: '#373753',
          textAlign: 'center',
        }}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{marginTop: 30}}>
          <Button onPress={showDatepicker} title="Set Date" />
        </View>
        <View style={{marginTop: 30, marginLeft: 30}}>
          <Button onPress={showTimepicker} title="Set Time" />
        </View>
      </View>
      <View
        style={{
          width: 300,
          height: 50,
          borderWidth: 1,
          borderRadius: 90,
          marginTop: 20,
          backgroundColor: '#373753',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'white'}}>{text}</Text>
      </View>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          width: 300,
          height: 50,
          justifyContent: 'center',
          borderRadius: 90,
          marginTop: 20,
          backgroundColor: '#FFCA3C',
        }}
        onPress={insertData}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>SAVE</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          //is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

function MyTasks() {
  const [items, setItems] = useState([]);
  const [empty, setEmpty] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM Task', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setItems(temp);

          if (results.rows.length >= 1) {
            setEmpty(false);
          } else {
            setEmpty(true)
          }

        }
      );

    });
  }, []);

  const listViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000'
        }}
      />
    );
  };

  const emptyMSG = (status) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

        <Text style={{ fontSize: 25, textAlign: 'center' }}>
          No Record Inserted Database is Empty...
        </Text>

      </View>
    );
  }
  const deleteData = key => {
    console.log('key: ', key);
    if (key == '') {
      Alert.alert('No key found');
    } else {
      db.transaction(function (tx) {
        tx.executeSql(
          'DELETE FROM Task WHERE Key = ?',
          [key],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert('Data Deleted Successfully....');
            } else Alert.alert('Failed....');
          }
        );
      });

    }
  }

  const handleVoice = ttstext => {
    Tts.speak(ttstext);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {empty ? emptyMSG(empty) :

          <FlatList
            data={items}
            ItemSeparatorComponent={listViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>
              <View key={item.Task} style={{ borderBottomWidth:1, flexDirection:"row"}}>
                <View>
                  <Text style={styles.itemsStyle}> Key: {item.Key} </Text>
                  <Text style={styles.itemsStyle}> Title: {item.Title} </Text>
                  <Text style={styles.itemsStyle}> Details: {item.Detail} </Text>
                  <Text style={styles.itemsStyle}> Date: {item.RDate} </Text>
                  <Text style={styles.itemsStyle}> Time: {item.RTime} </Text>
                </View>
                <View style={{ marginLeft:200}}>
                <TouchableOpacity>
                    <Image
                      source={require('./android/app/src/main/Images/editing.png')}
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: 'black',
                      }}
                    />
                </TouchableOpacity>
                  
                  <TouchableOpacity
                  onPress={deleteData(item.Key)}>
                    <Image
                      source={require('./android/app/src/main/Images/delete.png')}
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: 'black',
                        marginTop: 20,
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleVoice(item.Title)}>
                    <Image
                      source={require('./android/app/src/main/Images/speaker.png')}
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: 'black',
                        marginTop: 20,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                
              </View>
            }
          />
        }
      </View>
    </SafeAreaView>

  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
