import React, { Component } from 'react';
import ArticlesStore from '../../stores/ArticlesStore';
import ActionTypes from '../../constants/ActionTypes';
import ArticlesActions from '../../actions/ArticlesActions';

import {
    Row,
    Col,
    Table,
    Panel,
    Grid,
    FlexboxGrid,
    SelectPicker,
} from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

class ArticlesPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
        };

        this.onGetArticles = this.onGetArticles.bind(this);

        this.generateArticles = this.generateArticles.bind(this);
    }

    componentDidMount() {
        ArticlesStore.listen(ActionTypes.GET_ARTICLES, this.onGetArticles);

        ArticlesActions.getArticles();
    }

    componentWillUnmount() {
        ArticlesStore.unlisten(ActionTypes.GET_ARTICLES, this.onGetArticles);
    }

    onGetArticles(data) {
        this.setState({ articles: data });
        console.log(data);
    }

    generateArticles(nbArticles = 9) {
        const { articles } = this.state;

        const items = [];
        var i = 0;

        for (const [index, article] of articles.entries()) {
            if (i >= nbArticles) break;
            items.push(article);
            i++;
        }

        return items;
    }

    render() {
        const articles = this.generateArticles();

        return (
            <Panel
                bodyFill
                header={
                    <Grid fluid>
                        <Row>
                            <Col xs={8}>
                                <h3>NEWS</h3>
                            </Col>
                            <Col xs={16}>
                                <FlexboxGrid
                                    justify="end"
                                    style={{ paddingTop: '5px' }}
                                ></FlexboxGrid>
                            </Col>
                        </Row>
                    </Grid>
                }
            >
                <Table
                    virtualized
                    height={400}
                    data={articles}
                    showHeader={false}
                >
                    <Column flexGrow={1}>
                        <HeaderCell></HeaderCell>
                        <Cell dataKey="title">
                            {(rowData) => {
                                return (
                                    <>
                                        <a
                                            href={rowData.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="article-link"
                                        >
                                            {rowData.title}
                                        </a>
                                        <small>
                                            {` - ${new Date(
                                                rowData.publishedAt
                                            ).toLocaleString('en-US')}`}
                                        </small>
                                    </>
                                );
                            }}
                        </Cell>
                    </Column>
                </Table>
            </Panel>
        );
    }
}

export default ArticlesPanel;
