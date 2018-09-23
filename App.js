import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  ScrollView,
  FlatList,
  TextInput,
  Button,
  KeyboardAvoidingView,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS == 'ios' ? 20 : StatusBar.currentHeight;
// TODOを保持するKey/Valueストアのキーを定義
const TODO = "@todoapp.todo"

const TodoItem = (props) => {
  let textStyle = styles.todoItem
  if (props.done === true) {
    textStyle = styles.todoItemDone
  }
  return (
    <TouchableOpacity onPress={props.onTapTodoItem}>
      <Text style={textStyle}>{props.title}</Text>
    </TouchableOpacity>
  )
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: [], // Todoリストを空に
      currentIndex: 0,
      inputText: "", // テキスト入力用の箱を用意
      filterText: "", // filter用のテキストを追加
    }
  }

  // コンポーネントがマウントされた段階で読み込みを行う
  componentDiaMount() {
    this.loadTodo()
  }

  // AsyncStorageからTODOを読み込む処理
  loadTodo = async () => {
    try {
      const todoString = await AsyncStorage.getItem(TODO)
      if (todoString) {
        const todo = JSON.parse(todoString)
        const currentIndex = todo.length
        this.setState({ todo: todo, currentIndex: currentIndex })
      }
    } catch (e) {
      console.log(e)
    }
  }

  saveTodo = async (todo) => {
    try {
      const todoString = JSON.stringify(todo)
      await AsyncStorage.setItem(TODO, todoString)
    } catch (e) {
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

  onTapTodoItem = (todoItem) => {
    const todo = this.state.todo
    const index = todo.indexof(todoItem)
    todoItem.done = !todoItem.done
    todo[index] = todoItem
    this.setState({ todo: todo })
    this.saveTodo(todo)
  }

  render() {
    // フィルター処理
    const filterText = this.state.filterText
    let todo = this.state.todo
    if (filterText !== "") {
      todo = todo.filter(t => t.title.includes(filterText))
    }
    // ViewをKeyboardAvoidingViewへ変更、振る舞いをpaddingに
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.filter}>
          {/* フィルタ入力 */}
          <TextInput
            onChangeText={(text) => this.setState({ filterText: text })}
            value={this.state.filterText}
            style={styles.inputText}
            placeholder="Type filter text"
          />
        </View>

        {/* TODOリスト */}
        <ScrollView style={styles.todolist}>
          <FlatList data={todo}
            extraData ={this.state}
            renderItem={({ item }) => 
            <TodoItem
              title ={item.title}
              done = {item.done}
              onTapTodoItem={() => this.onTapTodoItem(item)}
            />
          }
            keyExtractor={(item, index) => "todo_" + item.index}
          />
        </ScrollView>

        <View style={styles.input}>
          {/* テキスト入力とボタンを追加 */}
          <TextInput
            onChangeText={(text) => this.setState({ inputText: Text })}
            value={this.state.inputText}
            style={styles.inputText}
            placeholder="Type your todo"
          />
          <Button
            onPress={this.onAddItem}
            title="Add"
            color="#841584"
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
    flexDirection: "row",
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
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  inputButton: {
    width: 100,
  },
  todoItem: {
    fontSize: 20,
    backgroundColor: "white",
  },
  todoItemDone: {
    fontSize: 20,
    backgroundColor: "red",
  },
});
