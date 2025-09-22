import { useState } from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [responseLog, setResponseLog] = useState<string>('Console ready. Click any button to start testing HTTP requests.');
  const [isLoading, setIsLoading] = useState(false);
  const [activeRequest, setActiveRequest] = useState<string>('');

  const generateRandomQuery = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const randomParam = Math.random().toString(36).substring(7);
    return `?id=${randomId}&param=${randomParam}&timestamp=${Date.now()}`;
  };

  const makeRequest = async (method: string, endpoint: string) => {
    setIsLoading(true);
    setActiveRequest(method);
    setResponseLog(`Making ${method} request to ${endpoint}...`);
    
    try {
      const url = endpoint + (method === 'GET' ? generateRandomQuery() : '');
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (method !== 'GET') {
        options.body = JSON.stringify({
          message: `Hello from ${method} request!`,
          timestamp: new Date().toISOString(),
          randomData: Math.random().toString(36).substring(7),
          method: method,
        });
      }

      const response = await fetch(url, options);
      const data = await response.json();
      
      const logMessage = `\n=== ${method} REQUEST COMPLETED ===\nURL: ${url}\nStatus: ${response.status} ${response.statusText}\nResponse Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}\n\nResponse Body:\n${JSON.stringify(data, null, 2)}\n\n${'='.repeat(50)}`;
      
      setResponseLog(logMessage);
      console.log(`${method} Response:`, data);
      
    } catch (error) {
      const errorMessage = `\n=== ${method} REQUEST FAILED ===\nError: ${error instanceof Error ? error.message : 'Unknown error'}\nTimestamp: ${new Date().toISOString()}\n\n${'='.repeat(50)}`;
      setResponseLog(errorMessage);
      console.error(`${method} Error:`, error);
    } finally {
      setIsLoading(false);
      setActiveRequest('');
    }
  };

  const handleGetRequest = () => makeRequest('GET', 'https://httpbin.proxyman.app/get');
  const handlePostRequest = () => makeRequest('POST', 'https://httpbin.proxyman.app/post');
  const handlePutRequest = () => makeRequest('PUT', 'https://httpbin.proxyman.app/put');
  const handleUpdateRequest = () => makeRequest('PATCH', 'https://httpbin.proxyman.app/patch');

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">HTTP Request Tester</ThemedText>
        <ThemedText style={styles.subtitle}>Test different HTTP methods with httpbin.proxyman.app</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.buttonContainer}>
        <Button 
          title={isLoading && activeRequest === 'GET' ? "Making GET Request..." : "GET Request"}
          onPress={handleGetRequest}
          disabled={isLoading}
          color="#007AFF"
        />
        <Button 
          title={isLoading && activeRequest === 'POST' ? "Making POST Request..." : "POST Request"}
          onPress={handlePostRequest}
          disabled={isLoading}
          color="#007AFF"
        />
        <Button 
          title={isLoading && activeRequest === 'PUT' ? "Making PUT Request..." : "PUT Request"}
          onPress={handlePutRequest}
          disabled={isLoading}
          color="#007AFF"
        />
        <Button 
          title={isLoading && activeRequest === 'PATCH' ? "Making UPDATE Request..." : "UPDATE (PATCH)"}
          onPress={handleUpdateRequest}
          disabled={isLoading}
          color="#007AFF"
        />
      </ThemedView>

      <ThemedView style={styles.consoleContainer}>
        <ThemedText type="defaultSemiBold" style={styles.consoleHeader}>Console Output</ThemedText>
        <ScrollView style={styles.consoleScroll} showsVerticalScrollIndicator={true}>
          <Text style={styles.consoleText}>{responseLog}</Text>
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: 40,
      default: 40,
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 24,
  },
  consoleContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  consoleHeader: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    fontSize: 14,
  },
  consoleScroll: {
    flex: 1,
    padding: 12,
  },
  consoleText: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
    color: '#00ff00',
    lineHeight: 16,
  },
});
