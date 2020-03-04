import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import movieActions from '../../redux/actions/movie.actions';
import RateMovie from '../rate-movie/RateMovie';
import MovieService from '../../services/MovieService';
import MainLayout from '../main-layout/MainLayout';
import useStyles from './MovieDetail.styles';
import { useIntl } from 'react-intl';
import Box from '../box/Box';

//consulta de peliculas - detalle
const MovieDetail = ({
  getMovieDetail,
  movie,
  match,
  history,
  removeLastMovie,
}) => {
  const classes = useStyles();
  const [average, setAverage] = useState(null);
  const { formatMessage } = useIntl();
  const handleCalculateRate = (movie, rateValue) => {
    MovieService.calculateRate(movie.imdbID, rateValue).then(response => {
      setAverage(response.data.average);
    });
  };

  useEffect(() => {
    if (!movie) {
      getMovieDetail(match.params.id);
    }
    if (!average && movie) {
      handleCalculateRate(movie);
    }
  });

  const clearCurrentMovie = () => {
    history.push('/search-movie/');
    removeLastMovie();
  };

  if (!movie) return null;

  const handleRateMovie = rateValue => {
    const user = JSON.parse(localStorage.getItem('user'));
    MovieService.rateMovieQueVer(
      user.email,
      movie.Title,
      movie.imdbID,
      rateValue,
    ).then(data => {}, handleCalculateRate(movie));
  };

  return (
    <MainLayout
      history={history}
      title={formatMessage({ id: 'searchMovie.movieDetail.title' })}
    >
      <Box className={classes.detailContainer}>
        <Grid container className={classes.detailContainer}>
          <Grid item xs={12} sm={8}>
            <Grid
              container
              style={{
                border: '1px solid #000',
                backgroundColor: '#eff5ef',
                margin: '5px',
                padding: '10px ',
                display: 'flex',
                width: '100%',
              }}
            >
              <Grid item xs={12} md={5} className={classes.movieDetail}>
                <h2>{movie.Title}</h2>
                <div>
                  <img
                    width='200'
                    alt={`Movie name: ${movie.Title}`}
                    src={
                      movie.Poster === 'N/A'
                        ? 'https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg'
                        : movie.Poster
                    }
                  />
                </div>
                <hr />
                {movie.Genre}
                <hr />
                IMDB rating: {movie.imdbRating}
                <hr />
                <div style={{ paddingBottom: '10px' }}>
                  Que Ver Rating: {average}
                </div>
                <RateMovie rateMovie={handleRateMovie} movie={movie} />
                Cast: {movie.Actors}
                <hr />
                <div>
                  <button
                    onClick={clearCurrentMovie}
                    className='btn btn-primary'
                    type='submit'
                  >
                    Back
                  </button>
                </div>
              </Grid>
              <Grid item xs={12} md={7} className={classes.plot}>
                <p>{movie.Plot}</p>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};
const mapStateToProps = ({ movieReducer }) => {
  // console.log(movieReducer, '-->lo que viene en reducer');
  return { movie: movieReducer.movieDetail };
};

const mapDispatchToProps = {
  getMovieDetail: movieActions.getMovieDetail,
  removeLastMovie: movieActions.removeLastMovie,
};

export default connect(mapStateToProps, mapDispatchToProps)(MovieDetail);
