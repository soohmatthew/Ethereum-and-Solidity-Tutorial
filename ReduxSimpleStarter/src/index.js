import React, { Component } from "react";
import ReactDOM, { render } from "react-dom";
import YTSearch from "youtube-api-search";
import _ from "lodash";

import SearchBar from "./components/search_bar";
import VideoList from "./components/video_list";
import VideoDetail from "./components/video_detail";
const API_KEY = "XXX";

// Create a new component, this component should produce some HTML
// Create a function called App

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      selectVideo: null,
    };

    this.videoSearch("surfboards");
  }

  videoSearch(term) {
    YTSearch({ key: API_KEY, term: term }, (videos) => {
      this.setState({
        videos: videos,
        selectVideo: videos[0],
      });
    });
  }

  render() {
    const videoSearch = _.debounce((term) => {
      this.videoSearch(term);
    }, 300);
    return (
      <div>
        <SearchBar onSearchTermChange={videoSearch} />
        <VideoDetail videos={this.state.selectVideo} />
        <VideoList
          onVideoSelect={(selectVideo) => {
            this.setState({ selectVideo });
          }}
          videos={this.state.videos}
        />
      </div>
    ); // Returns JSX (a dialect of JS, which is transpiled by babel)
  }
}

// Take the component's generated HTML and put it on the page (in the DOM)
ReactDOM.render(<App />, document.querySelector(".container"));
