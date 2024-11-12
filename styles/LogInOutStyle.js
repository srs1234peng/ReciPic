import {StyleSheet} from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  bigtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 30,
    fontFamily: 'Roboto', // Adjust font as needed
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'left',
    fontFamily: 'Roboto', // Adjust font as needed
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C5D3A',
    textAlign: 'center',
    marginVertical: 10,
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: '#1C5D3A',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    color: '#1C5D3A',
    textAlign: 'center',
    marginVertical: 10,
  },
});
