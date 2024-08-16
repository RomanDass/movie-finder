const checkStatus = (response) => {
  if (response.ok) {
    return response;
  }
  throw new Error('Request was either a 404 or 500');
}
const json = (response) => response.json();


const Movie = (props) => {
  const { Title, Year, imdbID, Type, Poster } = props.movie;
  
  return(
    <div className="row mb-2">
      <div className="col col-4 col-md-3 mb-3">
        <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
          <img src={Poster} className="img-fluid" />
        </a>
      </div>
      <div className="col-8 col-md-9 mb-3">
        <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
          <h4>{Title}</h4>
          <h5>{Type} | {Year}</h5>
        </a>
      </div>
    </div>
  )
}
class MovieFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      results: [],
      error: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
     this.setState({ searchTerm: event.target.value })
  }
  
  handleSubmit = (event) => {
    event.preventDefault();
    let { searchTerm } = this.state;
    searchTerm = searchTerm.trim();
    if (!searchTerm) {
      return;
    }

    fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=10c44f44`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.Response === 'False') {
          throw new Error(data.Error);
        }

        if (data.Response === 'True' && data.Search) {
          this.setState({ results: data.Search, error: '' });
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
  }
  
  render() {
    const { searchTerm, results, error } = this.state;
    
    return(
      <div className="container">
        <div className="col m-5">
          <form onSubmit={this.handleSubmit} className="form-container">
            <input 
              placeholder="ex.'Frozen' or 'The Godfather'"
              type="text" 
              value={searchTerm}
              onChange={this.handleChange}
              className="form-control mb-2"
              />
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
        {(() => {
          if (error) {
            return error;
          }
          return results.map((movie) => {
            return <Movie key={movie.imdbID} movie={movie} />;
          })
        })()}
      </div>
    )
  }
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<MovieFinder />);