import React, { useState, useEffect, useMemo } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity
} from "react-native";

import { getMockData } from "./data.js";

const optionEnum = {
  id: "id",
  time: "time"
};

const App = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [chosenId, setChosenId] = useState("");
  const [chosenOption, setChosenOption] = useState(optionEnum.id);
  const [optionToggle, setOptionToggle] = useState(false);
  useEffect(() => {
    /*
    const fetchData = async () => {
      return await fetch(
        "http://167.99.171.123:8080/api/report"
      );
    };
    */
    //because of the cors policy, I use mock data instead.
    const data = getMockData();
    setDeviceData(data.data);
  }, []);
  const formatDate = (date) => {
    const tmpDate = new Date(date);
    return `${tmpDate.getFullYear()}/${
      tmpDate.getMonth() + 1
    }/${tmpDate.getDate()}`;
  };
  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemRow}>
        <View style={styles.item}>
          <Text>{item.id}</Text>
        </View>
        <View style={styles.item}>
          <Text>{`lat: ${item.gps?.lat}`}</Text>
          <Text>{`long: ${item.gps?.long}`}</Text>
        </View>
        <View style={styles.item}>
          <Text>{`lat: ${item.battery?.battery1}`}</Text>
          <Text>{`long: ${item.battery?.battery2}`}</Text>
        </View>
        <View style={styles.item}>
          <Text>{item.date ? formatDate(item.date) : ""}</Text>
        </View>
      </View>
    );
  };

  const sortedDeviceData = useMemo(() => {
    const filteredData = chosenId
      ? deviceData.filter((d) => {
          return d.id?.includes(chosenId);
        })
      : deviceData;
    let sortedData = [];
    if (chosenOption === "id") {
      sortedData = filteredData.sort((a, b) => a.id.localeCompare(b.id));
    }
    if (chosenOption === "time") {
      sortedData = filteredData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }
    return sortedData;
  }, [deviceData, chosenOption, chosenId]);

  return (
    <ScrollView style={styles.app} contentContainerStyle={styles.scroller}>
      <View style={styles.inputPanel}>
        <Text style={styles.inputTitle}>id:</Text>
        <TextInput
          style={styles.input}
          value={chosenId}
          onChangeText={(text) => {
            setChosenId(() => text);
          }}
        />
        <Text style={styles.inputTitle}>orderBy:</Text>
        <View style={styles.optionPanel}>
          <TouchableOpacity
            onPress={() => {
              setOptionToggle((preOptionToggle) => !preOptionToggle);
            }}
          >
            <Text style={styles.optionBtnText}>{chosenOption}</Text>
          </TouchableOpacity>
        </View>
        {optionToggle && (
          <>
            {Object.keys(optionEnum).map((o) => (
              <TouchableOpacity
                key={o}
                style={styles.optionItem}
                onPress={() => {
                  setChosenOption(() => o);
                  setOptionToggle(() => false);
                }}
              >
                <Text style={styles.optionBtnText}>{o}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
      <View style={{ width: "100%", alignItems: "center" }}>
        <View style={[styles.itemRow, { borderWidth: 0, height: 30 }]}>
          <View style={styles.item}>
            <Text>id</Text>
          </View>
          <View style={styles.item}>
            <Text>gps</Text>
          </View>
          <View style={styles.item}>
            <Text>battery</Text>
          </View>
          <View style={styles.item}>
            <Text>date</Text>
          </View>
        </View>
        <FlatList
          style={{ width: "99%" }}
          data={sortedDeviceData}
          renderItem={renderItem}
          keyExtractor={(_, index) => `${index}`}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    marginVertical: 20
  },
  scroller: {
    alignItems: "center"
  },
  inputPanel: {
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15
  },
  inputTitle: {
    marginHorizontal: 10,
    fontSize: 16
  },
  input: {
    width: 80,
    height: "100%",
    borderWidth: 1
  },
  itemRow: {
    flexDirection: "row",
    width: "100%",
    height: 80,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  item: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  searchBtn: {
    width: 80,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10
  },
  searchBtnText: {
    color: "#fff"
  },
  optionPanel: {
    width: 80,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderColor: "rgba(0,0,0,0.2)"
  },
  optionBtnText: {
    color: "#000"
  },
  optionItem: {
    marginLeft: 5,
    width: 40,
    height: 35,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 255, 0.3)",
    borderColor: "rgba(0,0,0,0.2)"
  }
});

export default App;
