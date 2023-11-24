import { styled } from '@mui/system';

const useStyles = styled('div')((theme) => ({
  contentRoot: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  mapContainer: {
    position: 'relative',
    zIndex: 1,
    '&.leaflet-container': {
      width: '100%',
      height: '100%',
    },
  },
}));

export default useStyles;
