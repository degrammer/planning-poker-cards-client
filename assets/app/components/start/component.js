import { Component } from 'config/component';
import { startController } from 'components/start/controller';
import { startService } from 'components/start/service';
import 'components/start/style.css';

export class start extends Component {
    startController($scope, appConfig, app, componentLoader, PubSub, startService, $mdDialog) {
        "ngInject";
        //start  controller logic. (Controller logic should be outside of angular controller).
        let componentController = new startController();
        $scope.createSession = createSession;
        $scope.join = join;
        let socket = null;
        $scope.usersJoined = null;
        $scope.startSession = startSession;
        $scope.voteCard = voteCard;
        $scope.cardSelected = cardSelected;
        $scope.cancel = cancel;
        $scope.sendResultToEmail = sendResultToEmail;
        let votes = [];


        /*  Load this component inside another component view:
            import {start} from 'components/start/component'; (This line should be on the top of the component file)
            componentLoader.initialize(start,$scope); This will initialize the imported component
            Inside your view in order to load the async component you have to do the following:
         
            <div oc-lazy-load="startLazyLoad"> <start></start></div>

            To view the component controller test results go to /specs/start/specRunner.html
        */
        $scope.component = {
            name: 'start',
            state: 'admin.start'
        };

        PubSub.publish('component_start_Loaded');

        function apply(expression) {
            $scope.$apply(() => typeof expression == 'function' ? expression() : null);
        }

        function createSession(event) {
            $scope.creatingSession = true;
            event.preventDefault();
            startService.createSession()
                .done(onSessionCreated);

        }

        function join(event) {
            $scope.joining = true;
            event.preventDefault();

            if (!socket) {
                socket = io(appConfig.API_END_POINT);
            }
            let joinSession = "joined-" + $scope.joinSessionId;
            let startSession = "start-" + $scope.joinSessionId;
            let newVote = "new-vote-" + $scope.joinSessionId;
            socket.on(joinSession, onUserJoined);
            socket.on(startSession, onStartSession);
            socket.on(newVote, onNewVote);
            startService.join($scope.joinSessionId, $scope.user)
                .done(onJoinedSuccess);

        }


        function onSessionCreated(data) {
            apply(() => {

                $scope.creatingSession = false;
                $scope.sessionId = data.sessionId;
                $scope.joinSessionId = data.sessionId;

            });

        }

        function onJoinedSuccess(data) {
            apply(() => {

                $scope.joining = false;
                $scope.usersJoined = data;
                $scope.sessionId = $scope.joinSessionId;
            });

        }


        function onUserJoined(user) {
            apply(() => {

                getTeamMembers();

            });
        }

        function getTeamMembers() {
            startService.getTeamMembers($scope.joinSessionId)
                .done(onGetTeamMembersSuccess);
        }

        function onGetTeamMembersSuccess(data) {
            apply(() => {

                $scope.usersJoined = data;
            });
        }

        function startSession(event) {
            debugger;
            event.preventDefault();
            socket.emit("start", { sessionId: $scope.sessionId, director: $scope.user });

        }

        function onStartSession(data) {
            apply(() => {
                $scope.sessionStarted = true;
                $scope.sessionDirector = data;
            });

            getCards();
        }


        function getCards() {
            startService.getCards()
                .done(onGetCardsSuccess);
        }


        function onGetCardsSuccess(data) {
            apply(() => {
                $scope.cards = data.cards;
                $mdDialog.show({
                    contentElement: '#cardsDialog',
                    parent: angular.element(document.body),
                    escapeToClose: true,
                    clickOutsideToClose: true
                });


            });
        }

        function voteCard(card) {
            $scope.selectedCard = { card: card };
        }

        function cardSelected(event) {
            event.preventDefault();
            socket.emit("new-vote", { sessionId: $scope.sessionId, user: $scope.user, selectedCard: $scope.selectedCard });
        }


        function onNewVote(data) {

            let user = $scope.usersJoined.participants.filter((item) => item.participant == data.user)[0];

            apply(() => {

                if (user) {
                    user.voted = true;
                    user.selectedCard = data.selectedCard;
                    votes.push(user);
                    checkVotes();


                }
            });

        }

        function checkVotes() {
            let participants = $scope.usersJoined.participants.length;
            if (votes.length == participants) {
                $mdDialog.hide();
                $scope.votes = votes;

                $mdDialog.show({
                    contentElement: '#votesDialog',
                    parent: angular.element(document.body),
                    escapeToClose: true,
                    clickOutsideToClose: true
                });
            }
        }


        function cancel() {
            $mdDialog.hide();
        }

        function sendResultToEmail(event) {
            $scope.sending = true;

            let resultBuilder = '<h1>Planning Poker Session Result</h1><table><tr style="background-color:#b3b3b3;"><td>Team member</td><td>Card</td></tr>';

            for (var i = 0; i < $scope.votes.length; i++) {
                let vote = $scope.votes[i];
                resultBuilder += `<tr><td>${vote.participant}</td><td>${vote.selectedCard.card}</td></tr>`;
            }

            resultBuilder += "</table>";

            event.preventDefault();
            startService.sendResultEmail({
                "from_email": "rubenchorestrepo@gmail.com",
                "to_email": $scope.toEmail,
                "subject": "Planning Poker Session Result",
                "content": resultBuilder
            }).done(onEmailSent);

        }


        function onEmailSent()
        {
            $scope.sending = false;
            $scope.sendEmailDone = true;
        }
    }

    lazyLoad() {
        return [
            super.getTemplateUrl("components/start/view.html")
        ];
    }

    getComponentDefinition() {

        return {
            templateUrl: super.getTemplateUrl("components/start/view.html"),
            controller: this.startController,
            name: 'start'
        };

    }

    injectDependencies(angularApp) {
        new startService(angularApp);
    }

}