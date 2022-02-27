# include <iostream>
# include <string>
# include <vector>
# include <map>
# include <sstream>
# include <fstream>
# include <iomanip>
# include <math.h>
# include "json.hpp"

using json = nlohmann::json;
using namespace std;

int latIndexMax = 100;
int longIndexMax = 100;
int gridIndexMax = latIndexMax * longIndexMax;

typedef tuple<int, int> GridIndex;

struct Node {
    float latitude;
    float longitude;
    GridIndex gridIndex;
    vector<int> loads;
};

struct Edge {
    int load_id;
    string origin_city;
    string origin_state;
    float origin_latitude;
    float origin_longitude;
    string destination_city;
    string destination_state;
    float destination_latitude;
    float destination_longitude;
    int amount;
    string pickup_date_time;
};

struct Request {
    int input_trip_id;
    float start_latitude;
    float start_longitude;
    string start_time;
    string max_destination_time;
};

struct Output {
    int input_trip_id;
    vector<int> load_ids;
};

void createEdges(vector<Edge> * edges, string filename){
  ifstream filestream(filename);
  json j_complete = json::parse(filestream);
  int k = j_complete.size();
  Edge t;
  for(int i = 0; i<k; ++i){
  t.load_id = j_complete[i]["load_id"];
  t.origin_city = j_complete[i]["origin_city"];
  t.origin_state = j_complete[i]["origin_state"];
  t.origin_latitude = j_complete[i]["origin_latitude"];
  t.origin_longitude = j_complete[i]["origin_longitude"];
  t.destination_city = j_complete[i]["destination_city"];
  t.destination_state = j_complete[i]["destination_state"];
  t.destination_latitude = j_complete[i]["destination_latitude"];
  t.destination_longitude = j_complete[i]["destination_longitude"];
  t.amount = j_complete[i]["amount"];
  t.pickup_date_time = j_complete[i]["pickup_date_time"];
  edges->push_back(t);
  }
  return;
}


void createRequest(Request * request, string filename){
  ifstream filestream(filename);
  json j_complete = json::parse(filestream);
  int k = j_complete.size();
  // check k = 0
	request->input_trip_id = j_complete[0]["input_trip_id"];
	request->max_destination_time = j_complete[0]["max_destination_time"];
	request->start_latitude = j_complete[0]["start_latitude"];
	request->start_longitude = j_complete[0]["start_longitude"];
	request->start_time = j_complete[0]["start_time"];
	return;
}

vector<float> getMinMaxLatLong(vector<Edge> * edges){
    float minLat = (*edges)[0].origin_latitude;
    float maxLat = (*edges)[0].origin_latitude;
    float minLong = (*edges)[0].origin_longitude;
    float maxLong = (*edges)[0].origin_longitude;

    for (Edge edge : *edges){
        if (edge.origin_latitude < minLat){
            minLat = edge.origin_latitude;
        }
        if (edge.origin_latitude > maxLat){
            maxLat = edge.origin_latitude;
        }
        if (edge.destination_latitude < minLat){
            minLat = edge.destination_latitude;
        }
        if (edge.destination_latitude > maxLat){
            maxLat = edge.destination_latitude;
        }
        if (edge.origin_longitude < minLong){
            minLong = edge.origin_longitude;
        }
        if (edge.origin_longitude > maxLong){
            maxLong = edge.origin_longitude;
        }
        if (edge.destination_longitude < minLong){
            minLong = edge.destination_longitude;
        }
        if (edge.destination_longitude > maxLong){
            maxLong = edge.destination_longitude;
        }
    };

    return vector<float> {minLat, maxLat, minLong, maxLong};
}

float getDistance(Node N1, Node N2){
    // Andrew, please complete this
    float distance;

    float lat1 = N1.latitude;
    float lon1 = N1.longitude;
    float lat2 = N2.latitude;
    float lon2 = N2.longitude;

    const int R = 6371000; // metres
	const float f1 = lat1 * M_PI/180; // f, ? in radians
	const float f2 = lat2 * M_PI/180;
	const float df = (lat2-lat1) * M_PI/180;
	const float dl = (lon2-lon1) * M_PI/180;

	const float a = sin(df/2) * sin(df/2) +
	          cos(f1) * cos(f2) *
	          sin(dl/2) * sin(dl/2);
	const float c = 2 * atan2(sqrt(a), sqrt(1-a));

	distance = R * c; // in metres

    return distance;
}

GridIndex getGridIndex(float latitude, float longitude, float minLat, float maxLat, float minLong, float maxLong){
    int latindex = (int)(latitude/(maxLat - minLat));
    int longindex = (int)(longitude/(maxLong - minLong));


    GridIndex gridindex = make_pair(latindex, longindex);

    return gridindex;
}

void createNodes(vector<Edge> * edges, map<GridIndex, vector<Node>> *nodes){
    vector<float> minmaxLatLong = getMinMaxLatLong(edges);
    float minLat = minmaxLatLong[0];
    float maxLat = minmaxLatLong[1];
    float minLong = minmaxLatLong[2];
    float maxLong = minmaxLatLong[3];

    bool isAlreadyIn = false;

    Node potential;
    for (Edge edge : *edges){
        potential = {edge.origin_latitude, edge.origin_longitude, getGridIndex(edge.origin_latitude, edge.destination_longitude, minLat, maxLat, minLong, maxLong), vector<int>{edge.load_id}};
        if (nodes->find(potential.gridIndex) != nodes->end()){
          for (Node node : nodes->at(potential.gridIndex)){
              if (node.latitude == potential.latitude && node.longitude == potential.longitude) {
                  // node already exists
                  isAlreadyIn = false;
                  node.loads.push_back(edge.load_id);
                  cout << "add load" << endl;
                  // no need to stay in the loop, we can move to next node
                  break;
              }
          };
        }
        if (!isAlreadyIn){
            // new node
            nodes->insert(pair<GridIndex, vector<Node>>  (potential.gridIndex, vector<Node> {potential}));
            cout << "new node" << endl;
        }
        isAlreadyIn = false;
        Node potential = {edge.destination_latitude, edge.destination_longitude, getGridIndex(edge.destination_latitude, edge.destination_longitude, minLat, maxLat, minLong, maxLong), vector<int>{}};
        if (nodes->find(potential.gridIndex) != nodes->end()){
          for (Node node : nodes->at(potential.gridIndex)){
              if (node.latitude == potential.latitude && node.longitude == potential.longitude) {
                  // node already exists
                  isAlreadyIn = false;
                  // no need to stay in the loop, we can move to next node
                  break;
              }
          }
        }
        if (!isAlreadyIn){
            // new node
            nodes->insert(pair<GridIndex, vector<Node>>  (potential.gridIndex, vector<Node> {potential}));
            cout << "new node" << endl;
            cout << get<0>(potential.gridIndex) << " " << get<1>(potential.gridIndex) << potential.loads[0] << endl;
        }
        isAlreadyIn = false;
    }
    return;
}



int main(){
    // preprocessing
    vector<Edge> edges;
    createEdges(&edges, "123Loadboard_CodeJam_2022_dataset.json");

    vector<float> minmaxLatLong = getMinMaxLatLong(&edges);
    float minLat = minmaxLatLong[0];
    float maxLat = minmaxLatLong[1];
    float minLong = minmaxLatLong[2];
    float maxLong = minmaxLatLong[3];

    Request request;
    createRequest(&request, "request.json");

    map<GridIndex, vector<Node>> nodes;
    createNodes(&edges, &nodes);

    GridIndex testGridIndex = {2,3};

    // initialization
    Node firstNode = {
      request.start_latitude,
      request.start_longitude,
      getGridIndex(request.start_latitude, request.start_longitude, minLat, maxLat, minLong, maxLong),
      vector<int> {}
    };
    cout << edges.size() << endl;
    cout << nodes.size() << endl;
    for (auto iter = nodes.begin(); iter != nodes.end(); ++iter){
      cout << get<0>(iter->second[0].gridIndex) << " ";
      cout << get<1>(iter->second[0].gridIndex) << " ";
    }
    cout << endl;
}
