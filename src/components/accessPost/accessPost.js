import React, {useState} from 'react';
import { RichCell, Avatar, Card, Button, ScreenSpinner} from '@vkontakte/vkui';
import "./accessPost.module.css";
import ErrorSnackbar from '../errorSnackbar/errorSnackbar';
import DoneSnackbar from '../doneSnackbar/doneSnackbar';
import entryWrapper from '../entryWrapper';

const AccessPost = (props) => {
    const postData = props.postData;

    const user = postData.user;
    const phr = ["Дала", "Дал"];
    const [haveEdge, setHaveEdge] = useState(postData.haveEdge);

    const addEdge = async () => {
        postData.setPopout(<ScreenSpinner/>);
        try {
            await postData.postEdge(user.id);
            entryWrapper.pseudoFriends[user.id] = 1;
            setHaveEdge(1);
            postData.setPopout(null);
            postData.setSnackField(<DoneSnackbar onClose={()=>{postData.setSnackField(null)}}/>);
        }
        catch (error){
            postData.setPopout(null);
            postData.setSnackField(<ErrorSnackbar onClose={()=>{postData.setSnackField(null)}}/>);
        }
    };

    return (
        <Card size="l" mode="shadow" className="TextPost">
            <RichCell
                before={<Avatar size={72} src={user.photo_100} />}
                caption={`${phr[(user.sex === 2) ? 1 : 0]} вам доступ к записям`}
            >
                {`${user.first_name} ${user.last_name}`}
            </RichCell>
            <Button onClick={addEdge}
                size="xl" disabled={haveEdge}
            >
                {haveEdge ? "Вы уже дали доступ" : "Дать доступ в ответ"}
            </Button>
        </Card>
    );
};

export default AccessPost;