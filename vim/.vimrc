"Vim configuration file -- Marius Cramer (marcramer@protonmail.com)
"vim-plug autoload
if empty(glob('~/.vim/autoload/plug.vim'))
	silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
				\ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
	autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif

"Vim-Plug configuration–––––––––––––––––––––––––––––––––––––––––––––––––––––––––
call plug#begin('~/vim/plugged')
Plug 'sirver/ultisnips'
	let g:UltiSnipsExpandTrigger = '<tab>'
	let g:UltiSnipsJumpForwardTrigger = '<tab>'
	let g:UltiSnipsJumpBackwardTrigger = '<s-tab>'
Plug 'lervag/vimtex'
	let g:tex_flavor='latexmk'
	let g:vimtex_view_method='zathura'
	let g:vimtex_quickfix_mode=0
Plug 'KeitaNakamura/tex-conceal.vim'
	let g:tex_conceal='abdmg'
Plug 'vim-airline/vim-airline'
	let g:airline_powerline_fonts = 1
	if !exists('g:airline_symbols')
		let g:airline_symbols = {}
	endif
	let g:airline_left_sep = ''
	let g:airline_left_alt_sep = ''
	let g:airline_right_sep = ''
	let g:airline_right_alt_sep = ''
	let g:airline_symbols.readonly = ''
Plug 'vim-airline/vim-airline-themes'
	let g:airline_theme='ayu_mirage'
Plug 'arcticicestudio/nord-vim'
Plug 'dylanaraps/wal.vim'
Plug 'flrnd/candid.vim'
Plug 'junegunn/goyo.vim'
	let g:goyo_width = 105
	let g:goyo_height = 60
Plug 'junegunn/limelight.vim'
	let g:limelight_default_coefficient = 1
	let g:limelight_conceal_ctermfg = 'gray'
Plug 'airblade/vim-gitgutter'
Plug 'scrooloose/nerdtree'
	let NERDTreeShowHidden = 0
	let NERDTreeQuitOnOpen = 1
	let NERDTreeMinimalUI = 1
	let NERDTreeDirArrows = 1
Plug 'Xuyuanp/nerdtree-git-plugin'
Plug 'ryanoasis/vim-devicons'
Plug 'vim-scripts/vim-auto-save'
	let g:auto_save = 1 "enable on startup
	let g:auto_save_in_insert_mode = 0
Plug 'severin-lemaignan/vim-minimap'
Plug 'jiangmiao/auto-pairs'
Plug 'chriskempson/base16-vim'
Plug 'cramermarius/forest-nord-vim', { 'branch': 'develop' }
Plug 'KeitaNakamura/tex-conceal.vim', {'for': 'tex'}
Plug 'tpope/vim-fugitive'
Plug 'severin-lemaignan/vim-minimap'
call plug#end()
"––––––––––––––––––––––––––––––––––––––––––––––––––––––––-––––––––––––––––––––––


"vim settings–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
set shiftwidth=4
set tabstop=4
set noexpandtab
set noshowmode
set tw=90
set smartcase
set ignorecase
set hlsearch
set conceallevel=2
set nocursorline
set foldmethod=syntax
set foldnestmax=10
set foldlevel=2
set relativenumber
set number
set encoding=UTF-8
set hlsearch!
set smartindent
set autoindent
filetype indent on
set spell
set spelllang=de,en_gb
syntax enable
filetype plugin on
set omnifunc=syntaxcomplete#Complete
set listchars=tab:\|\ "indentation lines
set list
set termguicolors
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


" Theme–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
colorscheme forest-nord
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


" Folding behaviour–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
augroup remember_folds
	autocmd!
	autocmd BufWinLeave ?* mkview | filetype detect
	autocmd BufWinEnter ?* silent loadview | filetype detect
augroup END
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


" NERDTree––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
" open NERDTree on default
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


"Goyo functions–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
function! s:goyo_enter()
	set number
	set relativenumber
	set showmode
	set noshowcmd
	Limelight
endfunction

function! s:goyo_leave()
	set number
	set relativenumber
	Limelight!
endfunction

autocmd! User GoyoEnter nested call <SID>goyo_enter()
autocmd! User GoyoLeave nested call <SID>goyo_leave()
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
autocmd FileType gitcommit exec 'au VimEnter * startinsert'

"Trailing whitespace highlighting-----------------------------------------------
highlight ExtraWhitespace ctermbg=blue guibg=#BF616A
match ExtraWhitespace /\s\+$/
autocmd BufWinEnter * match ExtraWhitespace /\s\+$/
autocmd InsertEnter * match ExtraWhitespace /\s\+\%#\@<!$/
autocmd InsertLeave * match ExtraWhitespace /\s\+$/
autocmd BufWinLeave * call clearmatches()

"Mappings–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
noremap <C-y> :tabn<CR>
noremap <C-o> :Goyo<CR>
noremap <C-x> :NERDTreeToggle<CR>
nnoremap <C-i> :set hlsearch!<CR>
inoremap <C-l> <c-g>u<Esc>[s1z=`]a<c-g>u
inoremap <C-f> <Esc>: silent exec '.!inkscape-figures create "'.getline('.').'" "'.b:vimtex.root.'/figures/"'<CR><CR>:w<CR>
nnoremap <C-f> : silent exec '!inkscape-figures edit "'.b:vimtex.root.'/figures/" > /dev/null 2>&1 &'<CR><CR>:redraw!<CR>
noremap <Up> <Nop>
noremap <Down> <Nop>
noremap <Left> <Nop>
noremap <Right> <Nop>
nmap <C-p> :set nonu norelativenumber <bar> :GitGutterDisable <bar> :se conceallevel=0<CR>
nmap <S-p> :set nu relativenumber <bar> :GitGutterEnable <bar> :se conceallevel=2<CR>
" au VimEnter * silent! !xmodmap -e 'clear Lock' -e 'keycode 0x37 = Escape'
" au VimLeave * silent! !xmodmap -e 'clear Lock' -e 'keycode 0x37 = Control_L'
" below: spellcheck correct last typo
inoremap <C-l> <c-g>u<Esc>[s1z=`]a<c-g>u
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
