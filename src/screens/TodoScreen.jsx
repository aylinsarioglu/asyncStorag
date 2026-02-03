import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AddCircle,
  BagTick,
  CloseCircle,
  Edit2,
  TickCircle,
} from 'iconsax-react-native';
import {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import prompt from 'react-native-prompt-android';
import LinearGradient from 'react-native-linear-gradient';
import uuid from 'react-native-uuid';

const TodoScreen = () => {
  // Kullanıcı tarafından girilen todo öğesini saklamak için state
  const [todo, setTodo] = useState('');

  // todo listesini saklamak için state
  const [todos, setTodos] = useState([]);

  // todo listesini asyncStorage  kaydetme fonksiyonu
  const saveTodos = async saveTodo => {
    try {
      // todos verisini async storage kaydediyoruz.
      await AsyncStorage.setItem('todos', JSON.stringify(saveTodo));
    } catch (error) {
      console.log('error', error);
    }
  };

  // yeni bir todo eklemek için kullanılan fonksiyon

  const addTodo = () => {
    // eğer kullanıcı bir metin girdiyse
    if (todo) {
      //  yeni todo nesnesini oluştur
      const updateTodos = [...todos, {id: uuid.v4(), text: todo}];

      //todo listesini güncelliyoruz
      setTodos(updateTodos);

      //  yeni todoyu asyncstorage kaydediyoruz.
      saveTodos(updateTodos);

      // girdi alanını temizliyoruz.
      setTodo('');
    }
  };

  // asyncStorageden todos listesini yükleme fonksiyonu
  const loadTodos = async () => {
    try {
      // todos verisini asyncstorageden alıyoruz.
      const storedData = await AsyncStorage.getItem('todos');
      // eğer veri varsa json olarak parse edip todos stateine aktarıyoruz.
      if (storedData) {
        setTodos(JSON.parse(storedData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // bir todo ögesinin tamamlanma durumunu değiştiren fonksiyon
  const complateTodo = id => {
    // todos listesini mapleyerek idsi eşleşen ögeyi buluruz.
    const updatedTodos = todos.map(item =>
      item.id === id ? {...item, complated: !item.complated} : item,
    );

    //  todo listesini güncelliyoruz.
    setTodos(updatedTodos);

    // yeni listeyi asyncStorage kaydediyoruz.
    saveTodos(updatedTodos);
  };

  // delete(silme) butonu
  const deleteTodo = id => {
    // silinecek todoyu filtreliyoruz.
    const updatedTodos = todos.filter(item => item.id !== id);
    // todo listemizi güncelle
    setTodos(updatedTodos);
    // yeni listeyi asyncStorage kaydet
    saveTodos(updatedTodos);
  };

 const updateTodos = id => {
  const exitingTodo = todos.find(x => x.id === id);
  if (!exitingTodo) return;

  prompt(
    'Edit Todo',
    'Update your todo',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: newUpdateText => {
          if (newUpdateText) {
            const updatedTodos = todos.map(item =>
              item.id === id ? {...item, text: newUpdateText} : item,
            );
            setTodos(updatedTodos);
            saveTodos(updatedTodos);
          }
        },
      }, 
       'plain-text'// alertin tipi(sadece düz metin)
    ],
    {
      cancelable: true,
      defaultValue: exitingTodo.text,  // varsayılan metin olarak mevcut todoya ekledim
      placeholder: 'Edit...',
    },
  );
};


  // uygulama ilk açıldığında todos listesini yüklemek için useEffect kullanıyoruz.
  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <LinearGradient colors={['#fef3c7', '#a78bfa']} style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headerText}> TO-DO LIST </Text>

        {/* todo ekleme inputu */}

        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={text => setTodo(text)}
            value={todo}
            placeholder="Type a Todo"
            style={styles.input}
          />
          {/* to do ekleme butonu  */}

          <TouchableOpacity
            onPress={addTodo}
            style={[styles.button, styles.addButton]}>
            <Text>
              <AddCircle size="32" color="#FF8A65" variant="Broken" />
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={todos}
          renderItem={({item}) => (
            <View style={styles.todoItem}>
              <Text
                style={[
                  styles.todoText,
                  item.complated && styles.complatedText,
                ]}>
                {item?.text}
              </Text>

              {/* todo ögesine ait butonlar */}
              <View style={{flexDirection: 'row'}}>
                {/* tamamlama butonunu ekle */}
                <View>
                  <TouchableOpacity
                    style={[styles.button, styles.complateButton]}
                    onPress={() => complateTodo(item?.id)}>
                    <Text>
                      {/* tamamlanmışsa bir x ikonu, tamamlanmamışsa onay işareti koy */}
                      {item.complated ? (
                        <CloseCircle
                          size="24"
                          color="#FF8A65"
                          variant="Broken"
                        />
                      ) : (
                        <TickCircle
                          size="27"
                          color="#FF8A65"
                          variant="Broken"
                        />
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* silme butonu ekleme */}
                <View>
                  <TouchableOpacity
                    onPress={() => deleteTodo(item?.id)}
                    style={[styles.button, styles.deleteButton]}>
                    <Text>
                      <BagTick size="27" color="#FF8A65" variant="Broken" />
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* düzenleme butonu */}
                <View >
                  <TouchableOpacity
                    onPress={() => updateTodos(item.id)}
                    style={[styles.button, styles.updateButton]}>
                    <Text>
                      <Edit2 size="27" color="#FF8A65" variant="Broken" />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: 'gray',
    flex: 1,
  },
  button: {
    marginLeft: 10,
    borderRadius: 5,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  todoText: {
    color: '#000',
    textDecorationLine: 'none',
    fontSize: 18,
    fontWeight: 'bold',
  },
  complateButton: {
    padding: 10,
  },
  deleteButton: {
    padding: 10,
  },
  complatedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  updateButton: {
    padding: 10,
  },
});
