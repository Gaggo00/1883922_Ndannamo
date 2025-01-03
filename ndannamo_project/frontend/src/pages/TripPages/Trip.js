import InternalMenu from "./InternalMenu";
import TripChat from "./TripChat";



export default function Trip() {


    const { id } = useParams();
    const [tripInfo, setTripInfo] = useState({
        id:'',
        title: '',
        locations: [],
        creationDate:'',
        startDate : '',
        endDate : '',
        createdBy:'',
        list_participants: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTripInfo();
    }, []);

    const fetchTripInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }
            const response = await TripService.getTrip(id,token);

            if (response) {
                setTripInfo(response);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };



    return (
        <InternalMenu></InternalMenu>

    );
}