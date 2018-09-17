import React from 'react';
import { StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  Platform, 
  ScrollView, 
  FlatList, 
  TextInput, 
  Button, 
  KeyboardAvoidingView,
  AsyncStorage
} from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS == 'ios' ? 20 : StatusBar.currentHeight;
// TODOを保持するKey/Valueストアのキーを定義
const TODO = "@todoapp.todo"

export default class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      todo: [], // Todoリストを空に
      currentIndex: 0,
      inputText: "", // テキスト入力用の箱を用意
    }
  }

  // コンポーネントがマウントされた段階で読み込みを行う
  componentDiaMount(){
    this.loadTodo()
  }

  // AsyncStorageからTODOを読み込む処理
  loadTodo = async () =>{
    try{
      const todoString = await AsyncStorage.getItem(TODO)
      if(todoString){
        const todo = JSON.parse(todoString)
        const currentIndex = todo.length
        this.setState({todo: todo, currentIndex: currentIndex})
      }
    }catch(e){
      console.log(e)      
    }
  }

  saveTodo = async (todo) => {
    try {
      const todoString = JSON.stringify(todo)
      await AsyncStorage.getItem(TODO, todoString)
    } catch(e){
      console.log(e)
    }
  }

  // TODOリストへの追加処理
  onAddItem = () => {
    const title = this.state.inputText
    if (title == "") {
      return
    }
    const index = this.state.currentIndex + 1
    const newTodo = { index: index, title: title, done: false }
    const todo = [...this.state.todo, newTodo]
    this.setState({
      todo: todo,
      currentIndex: index,
      inputText: ""
    })
    // SaveTodoを呼んで保存する
    this.saveTodo(todo)
  }

  render() {
    // ViewをKeyboardAvoidingViewへ変更、振る舞いをpaddingに
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {/* フィルターの部分 */}
        <View style={styles.filter}>
          <Text>Filterがここに配置されます！</Text>
        </View>
        {/* TODOリスト */}
        <ScrollView style={styles.todolist}>
          <FlatList data={this.state.todo}
            renderItem={({ item }) => <Text>{item.title}</Text>}
            keyExtractor={(item, index) => "todo_" + item.index}
          />
        </ScrollView>
        <View style={styles.input}>
          {/* テキスト入力とボタンを追加 */}
          <TextInput
            onChangeText={(text) => this.setState({ inputText: Text })}
            value={this.state.inputText}
            style={styles.inputText}
          />
          <Button
            onPress = {this.onAddItem}
            title = "Add"
            color = "#841584"
            style={styles.inputButton}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: STATUSBAR_HEIGHT,
  },
  filter: {
    height: 30,
  },
  todolist: {
    flex: 1,
  },
  input: {
    height: 30,
    flexDirection: "row", // 下にある要素を横に並べる 
  },
  inputText: {
    flex: 1,
  },
  inputButton: {
    width: 100,
  }
});
